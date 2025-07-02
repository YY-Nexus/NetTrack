"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOllamaModels } from "@/hooks/use-ollama-models"
import { RefreshCw, Server, AlertCircle, CheckCircle, XCircle, Zap, Cpu } from "lucide-react"

interface OllamaModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  endpoint: string
  className?: string
}

export function OllamaModelSelector({ value, onValueChange, endpoint, className }: OllamaModelSelectorProps) {
  const { models, groupedModels, status, isLoading, error, lastRefresh, refreshModels, getModelInfo, updateEndpoint } =
    useOllamaModels(endpoint)

  const [selectedModelInfo, setSelectedModelInfo] = useState<any>(null)

  // 当选择的模型改变时，更新模型信息
  useEffect(() => {
    if (value) {
      const info = getModelInfo(value)
      setSelectedModelInfo(info)
    } else {
      setSelectedModelInfo(null)
    }
  }, [value, getModelInfo])

  // 当端点改变时，更新服务
  useEffect(() => {
    updateEndpoint(endpoint)
  }, [endpoint, updateEndpoint])

  // 获取状态图标和颜色
  const getStatusIcon = () => {
    switch (status.status) {
      case "running":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "stopped":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      default:
        return <Server className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case "running":
        return `在线 (${status.models_count || 0} 个模型)`
      case "stopped":
        return "服务未启动"
      case "error":
        return "连接错误"
      default:
        return "未知状态"
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "running":
        return "text-green-300"
      case "stopped":
        return "text-red-300"
      case "error":
        return "text-yellow-300"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 服务状态 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>Ollama {getStatusText()}</span>
              {status.version && (
                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                  v{status.version}
                </Badge>
              )}
            </div>
            <Button
              onClick={refreshModels}
              disabled={isLoading}
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              刷新
            </Button>
          </div>
        </CardHeader>
        {lastRefresh && (
          <CardContent className="pt-0">
            <p className="text-white/60 text-xs">最后更新：{lastRefresh.toLocaleString("zh-CN")}</p>
          </CardContent>
        )}
      </Card>

      {/* 错误提示 */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 模型选择器 */}
      <div>
        <label className="text-white text-sm font-medium mb-2 block">选择模型</label>
        <Select value={value} onValueChange={onValueChange} disabled={status.status !== "running" || isLoading}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue
              placeholder={
                status.status !== "running"
                  ? "Ollama服务未运行"
                  : models.length === 0
                    ? "未找到已安装的模型"
                    : "选择一个模型"
              }
            />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-white/20 text-white max-h-[300px]">
            {groupedModels.map((group) => (
              <div key={group.category}>
                <div className="px-2 py-1.5 text-sm font-semibold text-white/70 bg-white/5">{group.category}</div>
                {group.models.map((model) => (
                  <SelectItem key={model.name} value={model.name} className="text-white hover:bg-white/10">
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate">{model.name}</span>
                      <div className="flex items-center space-x-1 ml-2">
                        <Badge variant="outline" className="border-white/30 text-white/60 text-xs">
                          {model.parameters}
                        </Badge>
                        <Badge variant="outline" className="border-white/30 text-white/60 text-xs">
                          {model.size}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 选中模型的详细信息 */}
      {selectedModelInfo && (
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-300/20">
          <CardHeader>
            <CardTitle className="text-white text-sm flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              模型信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>模型名称：</span>
                  <span className="text-blue-300 font-mono text-xs">{selectedModelInfo.name}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>参数规模：</span>
                  <span className="text-green-300">{selectedModelInfo.parameters}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>文件大小：</span>
                  <span className="text-purple-300">{selectedModelInfo.size}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80">
                  <span>模型类别：</span>
                  <span className="text-cyan-300">{selectedModelInfo.category}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>推荐内存：</span>
                  <span className="text-yellow-300">{selectedModelInfo.memory}</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>模型状态：</span>
                  <span className="text-green-300">✅ 已安装</span>
                </div>
              </div>
            </div>

            {/* 模型详细信息 */}
            {selectedModelInfo.details && (
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/70">
                  {selectedModelInfo.details.family && (
                    <div className="flex justify-between">
                      <span>模型家族：</span>
                      <span>{selectedModelInfo.details.family}</span>
                    </div>
                  )}
                  {selectedModelInfo.details.format && (
                    <div className="flex justify-between">
                      <span>文件格式：</span>
                      <span>{selectedModelInfo.details.format}</span>
                    </div>
                  )}
                  {selectedModelInfo.details.quantization_level && (
                    <div className="flex justify-between">
                      <span>量化级别：</span>
                      <span>{selectedModelInfo.details.quantization_level}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>模型ID：</span>
                    <span className="font-mono">{selectedModelInfo.digest.substring(0, 12)}...</span>
                  </div>
                </div>
              </div>
            )}

            {/* 性能建议 */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mt-3">
              <div className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-400 mt-0.5" />
                <div className="text-blue-200 text-xs">
                  <div className="font-semibold mb-1">💡 使用建议</div>
                  <ul className="space-y-1">
                    <li>• 确保系统内存不少于 {selectedModelInfo.memory}</li>
                    <li>• 建议使用GPU加速以获得更好性能</li>
                    <li>• 大参数模型建议调整上下文长度</li>
                    {selectedModelInfo.category.includes("智谱AI") && <li>• 智谱AI模型支持中文对话和代码生成</li>}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 无模型提示 */}
      {status.status === "running" && models.length === 0 && !isLoading && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="text-yellow-200">
                <h4 className="font-semibold mb-1">📦 未找到已安装的模型</h4>
                <p className="text-sm mb-2">Ollama服务正在运行，但没有检测到已安装的模型。</p>
                <div className="text-xs space-y-1">
                  <p>您可以通过以下命令安装模型：</p>
                  <code className="block bg-black/20 p-2 rounded font-mono">ollama pull llama3.1:8b</code>
                  <code className="block bg-black/20 p-2 rounded font-mono">ollama pull qwen3:8b</code>
                  <code className="block bg-black/20 p-2 rounded font-mono">ollama pull chatglm3-6b:latest</code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
