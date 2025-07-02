"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useOllamaControl } from "@/hooks/use-ollama-control"
import {
  Play,
  Square,
  RefreshCw,
  TestTube,
  BarChart3,
  Power,
  Cpu,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

export function OllamaControlPanel() {
  const {
    isServiceRunning,
    isLoading,
    error,
    mode,
    autoStart,
    selectedModel,
    availableModels,
    testResult,
    stats,
    startService,
    stopService,
    setMode,
    setAutoStart,
    selectModel,
    testFunction,
    resetStats,
    checkServiceStatus,
  } = useOllamaControl()

  const [testInput, setTestInput] = useState("")
  const [testType, setTestType] = useState("text")

  const handleTest = () => {
    if (!testInput.trim()) {
      return
    }
    testFunction(testType, testInput)
  }

  const getStatusIcon = () => {
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />
    if (isServiceRunning) return <CheckCircle className="w-4 h-4 text-green-400" />
    if (error) return <XCircle className="w-4 h-4 text-red-400" />
    return <AlertCircle className="w-4 h-4 text-yellow-400" />
  }

  const getModeColor = (currentMode: string) => {
    switch (currentMode) {
      case "standalone":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "mixed":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* 服务控制区域 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            Ollama 服务控制
          </CardTitle>
          <CardDescription className="text-white/80">管理本地Ollama服务的启动、停止和配置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 服务状态 */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <div className="text-white font-semibold">服务状态: {isServiceRunning ? "运行中" : "已停止"}</div>
                {error && <div className="text-red-400 text-sm">{error}</div>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={checkServiceStatus}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              {isServiceRunning ? (
                <Button onClick={stopService} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white">
                  <Square className="w-4 h-4 mr-2" />
                  停止服务
                </Button>
              ) : (
                <Button
                  onClick={startService}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  启动服务
                </Button>
              )}
            </div>
          </div>

          {/* 模式选择 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                mode === "disabled" ? getModeColor("disabled") : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setMode("disabled")}
            >
              <CardContent className="p-4 text-center">
                <Power className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <div className="text-white font-semibold">禁用模式</div>
                <div className="text-white/60 text-sm">完全禁用Ollama</div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all duration-300 ${
                mode === "standalone" ? getModeColor("standalone") : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setMode("standalone")}
            >
              <CardContent className="p-4 text-center">
                <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-white font-semibold">单独调用</div>
                <div className="text-white/60 text-sm">仅使用Ollama</div>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all duration-300 ${
                mode === "mixed" ? getModeColor("mixed") : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => setMode("mixed")}
            >
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-white font-semibold">混合调用</div>
                <div className="text-white/60 text-sm">与云端API混合</div>
              </CardContent>
            </Card>
          </div>

          {/* 设置选项 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <Label className="text-white font-semibold">自动启动</Label>
                <div className="text-white/60 text-sm">系统启动时自动启动Ollama服务</div>
              </div>
              <Switch checked={autoStart} onCheckedChange={setAutoStart} />
            </div>

            <div className="space-y-2">
              <Label className="text-white">选择模型</Label>
              <Select value={selectedModel} onValueChange={selectModel}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="选择一个模型" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 功能测试区域 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            功能测试
          </CardTitle>
          <CardDescription className="text-white/80">测试Ollama服务的各项功能</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">测试类型</Label>
                <Select value={testType} onValueChange={setTestType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                    <SelectItem value="text">文本处理</SelectItem>
                    <SelectItem value="code">代码审查</SelectItem>
                    <SelectItem value="translate">翻译功能</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">测试输入</Label>
                <Textarea
                  placeholder="输入测试内容..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  rows={4}
                />
              </div>

              <Button
                onClick={handleTest}
                disabled={!isServiceRunning || !selectedModel || !testInput.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <TestTube className="w-4 h-4 mr-2" />
                开始测试
              </Button>
            </div>

            <div>
              <Label className="text-white">测试结果</Label>
              <Card className="bg-white/5 border-white/10 mt-2">
                <CardContent className="p-4">
                  <div className="text-white/90 whitespace-pre-wrap min-h-[200px] max-h-[300px] overflow-y-auto text-sm">
                    {testResult || "等待测试..."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              调用统计
            </div>
            <Button
              onClick={resetStats}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              重置统计
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalCalls}</div>
              <div className="text-white/70 text-sm">总调用数</div>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-green-400 mb-1">{stats.successfulCalls}</div>
              <div className="text-white/70 text-sm">成功调用</div>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-red-400 mb-1">{stats.failedCalls}</div>
              <div className="text-white/70 text-sm">失败调用</div>
            </div>

            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">
                {stats.avgResponseTime ? `${Math.round(stats.avgResponseTime)}ms` : "-"}
              </div>
              <div className="text-white/70 text-sm">平均响应</div>
            </div>
          </div>

          {stats.totalCalls > 0 && (
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="text-blue-300 font-semibold mb-2">性能概览</div>
              <div className="text-white/80 text-sm space-y-1">
                <div>成功率: {((stats.successfulCalls / stats.totalCalls) * 100).toFixed(1)}%</div>
                <div>
                  当前模式:{" "}
                  <Badge className={getModeColor(mode)}>
                    {mode === "disabled" ? "禁用" : mode === "standalone" ? "单独调用" : "混合调用"}
                  </Badge>
                </div>
                <div>
                  服务状态:{" "}
                  <Badge className={isServiceRunning ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
                    {isServiceRunning ? "运行中" : "已停止"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
