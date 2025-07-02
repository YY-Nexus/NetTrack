"use client"

import { useState, useEffect, useCallback } from "react"
import { ollamaService } from "@/lib/ollama-service"

export interface OllamaControlState {
  isServiceRunning: boolean
  isLoading: boolean
  error: string | null
  mode: "disabled" | "standalone" | "mixed"
  autoStart: boolean
  selectedModel: string
  availableModels: string[]
  testResult: string
  stats: {
    totalCalls: number
    successfulCalls: number
    failedCalls: number
    avgResponseTime: number
  }
}

export function useOllamaControl() {
  const [state, setState] = useState<OllamaControlState>({
    isServiceRunning: false,
    isLoading: false,
    error: null,
    mode: "disabled",
    autoStart: false,
    selectedModel: "",
    availableModels: [],
    testResult: "",
    stats: {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      avgResponseTime: 0,
    },
  })

  // 检查服务状态
  const checkServiceStatus = useCallback(async () => {
    try {
      const isRunning = await ollamaService.checkHealth()
      setState((prev) => ({ ...prev, isServiceRunning: isRunning, error: null }))

      if (isRunning) {
        const models = await ollamaService.listModels()
        setState((prev) => ({
          ...prev,
          availableModels: models,
          selectedModel: prev.selectedModel || models[0] || "",
        }))
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isServiceRunning: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }, [])

  // 启动服务
  const startService = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await ollamaService.startService()
      await new Promise((resolve) => setTimeout(resolve, 2000)) // 等待服务启动
      await checkServiceStatus()
      setState((prev) => ({ ...prev, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to start service",
      }))
    }
  }, [checkServiceStatus])

  // 停止服务
  const stopService = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      await ollamaService.stopService()
      setState((prev) => ({
        ...prev,
        isServiceRunning: false,
        isLoading: false,
        availableModels: [],
        selectedModel: "",
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to stop service",
      }))
    }
  }, [])

  // 切换模式
  const setMode = useCallback((newMode: OllamaControlState["mode"]) => {
    setState((prev) => ({ ...prev, mode: newMode }))

    // 保存到本地存储
    localStorage.setItem("ollama-mode", newMode)
  }, [])

  // 设置自动启动
  const setAutoStart = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, autoStart: enabled }))
    localStorage.setItem("ollama-auto-start", enabled.toString())
  }, [])

  // 选择模型
  const selectModel = useCallback((model: string) => {
    setState((prev) => ({ ...prev, selectedModel: model }))
    localStorage.setItem("ollama-selected-model", model)
  }, [])

  // 测试功能
  const testFunction = useCallback(
    async (functionType: string, input: string) => {
      if (!state.isServiceRunning || !state.selectedModel) {
        setState((prev) => ({ ...prev, testResult: "❌ 服务未运行或未选择模型" }))
        return
      }

      setState((prev) => ({ ...prev, testResult: "🔄 测试中..." }))
      const startTime = Date.now()

      try {
        let prompt = ""
        switch (functionType) {
          case "text":
            prompt = `请分析以下文本：${input}`
            break
          case "code":
            prompt = `请审查以下代码：${input}`
            break
          case "translate":
            prompt = `请翻译以下内容：${input}`
            break
          default:
            prompt = input
        }

        const response = await ollamaService.generateText(state.selectedModel, prompt)
        const responseTime = Date.now() - startTime

        setState((prev) => ({
          ...prev,
          testResult: `✅ 测试成功\n响应时间: ${responseTime}ms\n\n结果:\n${response}`,
          stats: {
            ...prev.stats,
            totalCalls: prev.stats.totalCalls + 1,
            successfulCalls: prev.stats.successfulCalls + 1,
            avgResponseTime:
              (prev.stats.avgResponseTime * prev.stats.successfulCalls + responseTime) /
              (prev.stats.successfulCalls + 1),
          },
        }))
      } catch (error) {
        const responseTime = Date.now() - startTime
        setState((prev) => ({
          ...prev,
          testResult: `❌ 测试失败\n错误: ${error instanceof Error ? error.message : "Unknown error"}`,
          stats: {
            ...prev.stats,
            totalCalls: prev.stats.totalCalls + 1,
            failedCalls: prev.stats.failedCalls + 1,
          },
        }))
      }
    },
    [state.isServiceRunning, state.selectedModel],
  )

  // 重置统计
  const resetStats = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stats: {
        totalCalls: 0,
        successfulCalls: 0,
        failedCalls: 0,
        avgResponseTime: 0,
      },
    }))
  }, [])

  // 初始化
  useEffect(() => {
    // 从本地存储恢复设置
    const savedMode = localStorage.getItem("ollama-mode") as OllamaControlState["mode"]
    const savedAutoStart = localStorage.getItem("ollama-auto-start") === "true"
    const savedModel = localStorage.getItem("ollama-selected-model")

    if (savedMode) {
      setState((prev) => ({ ...prev, mode: savedMode }))
    }
    if (savedAutoStart) {
      setState((prev) => ({ ...prev, autoStart: savedAutoStart }))
    }
    if (savedModel) {
      setState((prev) => ({ ...prev, selectedModel: savedModel }))
    }

    // 检查初始状态
    checkServiceStatus()

    // 如果启用自动启动且服务未运行，则启动服务
    if (savedAutoStart) {
      setTimeout(() => {
        checkServiceStatus().then(() => {
          if (!state.isServiceRunning) {
            startService()
          }
        })
      }, 1000)
    }

    // 定期检查服务状态
    const interval = setInterval(checkServiceStatus, 30000)
    return () => clearInterval(interval)
  }, [checkServiceStatus, startService, state.isServiceRunning])

  return {
    ...state,
    startService,
    stopService,
    setMode,
    setAutoStart,
    selectModel,
    testFunction,
    resetStats,
    checkServiceStatus,
  }
}
