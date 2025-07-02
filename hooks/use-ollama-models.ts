"use client"

// Ollama模型管理Hook

import { useState, useEffect, useCallback } from "react"
import { ollamaService, type OllamaModel, type OllamaStatusResponse } from "@/lib/ollama-service"

export interface GroupedModel {
  category: string
  models: {
    name: string
    size: string
    parameters: string
    memory: string
    digest: string
  }[]
}

export function useOllamaModels(endpoint?: string) {
  const [models, setModels] = useState<OllamaModel[]>([])
  const [groupedModels, setGroupedModels] = useState<GroupedModel[]>([])
  const [status, setStatus] = useState<OllamaStatusResponse>({ status: "stopped" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  // 更新服务端点
  const updateEndpoint = useCallback((newEndpoint: string) => {
    ollamaService.updateEndpoint(newEndpoint)
  }, [])

  // 检查Ollama状态
  const checkStatus = useCallback(async () => {
    try {
      const statusResult = await ollamaService.checkStatus()
      setStatus(statusResult)
      return statusResult
    } catch (error) {
      const errorStatus: OllamaStatusResponse = { status: "error" }
      setStatus(errorStatus)
      return errorStatus
    }
  }, [])

  // 刷新模型列表
  const refreshModels = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 首先检查状态
      const statusResult = await checkStatus()

      if (statusResult.status !== "running") {
        setModels([])
        setGroupedModels([])
        setError("Ollama服务未运行或无法连接")
        return
      }

      // 获取模型列表
      const response = await ollamaService.listModels()

      if (response.models) {
        setModels(response.models)

        // 按类别分组模型
        const grouped = groupModelsByCategory(response.models)
        setGroupedModels(grouped)

        setLastRefresh(new Date())
        setError(null)
      } else {
        setModels([])
        setGroupedModels([])
        setError("未找到已安装的模型")
      }
    } catch (error) {
      console.error("Failed to refresh models:", error)
      setError(error instanceof Error ? error.message : "获取模型列表失败")
      setModels([])
      setGroupedModels([])
    } finally {
      setIsLoading(false)
    }
  }, [checkStatus])

  // 按类别分组模型
  const groupModelsByCategory = useCallback((modelList: OllamaModel[]): GroupedModel[] => {
    const groups: { [key: string]: GroupedModel } = {}

    modelList.forEach((model) => {
      const category = ollamaService.getModelCategory(model.name)

      if (!groups[category]) {
        groups[category] = {
          category,
          models: [],
        }
      }

      groups[category].models.push({
        name: model.name,
        size: ollamaService.formatModelSize(model.size),
        parameters: ollamaService.getModelParameters(model.name),
        memory: ollamaService.getRecommendedMemory(model.name),
        digest: model.digest,
      })
    })

    // 按类别名称排序，智谱AI优先
    return Object.values(groups).sort((a, b) => {
      if (a.category.includes("智谱AI") && !b.category.includes("智谱AI")) return -1
      if (!a.category.includes("智谱AI") && b.category.includes("智谱AI")) return 1
      return a.category.localeCompare(b.category)
    })
  }, [])

  // 测试模型
  const testModel = useCallback(async (modelName: string, prompt?: string) => {
    return await ollamaService.testModel(modelName, prompt)
  }, [])

  // 获取模型详细信息
  const getModelInfo = useCallback(
    (modelName: string) => {
      const model = models.find((m) => m.name === modelName)
      if (!model) return null

      return {
        name: model.name,
        size: ollamaService.formatModelSize(model.size),
        parameters: ollamaService.getModelParameters(model.name),
        category: ollamaService.getModelCategory(model.name),
        memory: ollamaService.getRecommendedMemory(model.name),
        digest: model.digest,
        details: model.details,
        expires_at: model.expires_at,
        size_vram: model.size_vram,
      }
    },
    [models],
  )

  // 初始化时更新端点并刷新
  useEffect(() => {
    if (endpoint) {
      updateEndpoint(endpoint)
    }
    refreshModels()
  }, [endpoint, updateEndpoint, refreshModels])

  // 定期检查状态（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus()
    }, 30000)

    return () => clearInterval(interval)
  }, [checkStatus])

  return {
    models,
    groupedModels,
    status,
    isLoading,
    error,
    lastRefresh,
    refreshModels,
    checkStatus,
    testModel,
    getModelInfo,
    updateEndpoint,
  }
}
