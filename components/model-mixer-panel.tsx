"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ModelMixer, type APIProvider, type MixerConfig, defaultMixerConfig } from "@/lib/model-mixer"
import {
  Plus,
  Trash2,
  Settings,
  BarChart3,
  Download,
  Upload,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"

export function ModelMixerPanel() {
  const [config, setConfig] = useState<MixerConfig>(defaultMixerConfig)
  const [mixer, setMixer] = useState<ModelMixer | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [testPrompt, setTestPrompt] = useState("")
  const [testResult, setTestResult] = useState("")
  const [isTestingProvider, setIsTestingProvider] = useState<string | null>(null)

  // 初始化混合器
  useEffect(() => {
    const newMixer = new ModelMixer(config)
    setMixer(newMixer)
    setIsRunning(config.enabled)

    return () => {
      newMixer.destroy()
    }
  }, [config])

  // 定期更新统计信息
  useEffect(() => {
    if (!mixer || !isRunning) return

    const interval = setInterval(() => {
      setStats(mixer.getStats())
    }, 5000)

    return () => clearInterval(interval)
  }, [mixer, isRunning])

  // 添加提供商
  const addProvider = () => {
    const newProvider: APIProvider = {
      id: `provider-${Date.now()}`,
      name: "新提供商",
      type: "cloud",
      endpoint: "",
      model: "",
      enabled: true,
      weight: 1,
      priority: 1,
      timeout: 30000,
      maxRetries: 3,
      rateLimit: 60,
      lastUsed: 0,
      successCount: 0,
      errorCount: 0,
      avgResponseTime: 0,
    }

    setConfig((prev) => ({
      ...prev,
      providers: [...prev.providers, newProvider],
    }))
  }

  // 删除提供商
  const removeProvider = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      providers: prev.providers.filter((p) => p.id !== id),
    }))
  }

  // 更新提供商
  const updateProvider = (id: string, updates: Partial<APIProvider>) => {
    setConfig((prev) => ({
      ...prev,
      providers: prev.providers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  // 测试提供商
  const testProvider = async (provider: APIProvider) => {
    if (!mixer) return

    setIsTestingProvider(provider.id)
    try {
      const result = await mixer.callAPI("Hello, this is a test message.", {})
      setTestResult(`✅ 提供商 ${provider.name} 测试成功\n响应: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setTestResult(
        `❌ 提供商 ${provider.name} 测试失败\n错误: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    } finally {
      setIsTestingProvider(null)
    }
  }

  // 测试混合调用
  const testMixedCall = async () => {
    if (!mixer || !testPrompt.trim()) return

    setTestResult("🔄 测试混合调用中...")
    try {
      const result = await mixer.callAPI(testPrompt, {})
      setTestResult(`✅ 混合调用测试成功\n响应: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setTestResult(`❌ 混合调用测试失败\n错误: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // 导出配置
  const exportConfig = () => {
    if (!mixer) return

    const configJson = mixer.exportConfig()
    const blob = new Blob([configJson], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mixer-config-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // 导入配置
  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const configJson = e.target?.result as string
        const newConfig = JSON.parse(configJson)
        setConfig(newConfig)
      } catch (error) {
        alert("配置文件格式错误")
      }
    }
    reader.readAsText(file)
  }

  const getProviderStatusIcon = (provider: APIProvider) => {
    if (isTestingProvider === provider.id) {
      return <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
    }

    const successRate = provider.successCount / (provider.successCount + provider.errorCount) || 0
    if (successRate > 0.8) return <CheckCircle className="w-4 h-4 text-green-400" />
    if (successRate > 0.5) return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    return <XCircle className="w-4 h-4 text-red-400" />
  }

  return (
    <div className="space-y-6">
      {/* 混合器控制 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              模型混合器控制
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) => setConfig((prev) => ({ ...prev, enabled }))}
              />
              <Badge className={config.enabled ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}>
                {config.enabled ? "启用" : "禁用"}
              </Badge>
            </div>
          </CardTitle>
          <CardDescription className="text-white/80">配置和管理多个API提供商的混合调用策略</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 策略配置 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">调用策略</Label>
              <Select
                value={config.strategy.type}
                onValueChange={(type: any) =>
                  setConfig((prev) => ({
                    ...prev,
                    strategy: { ...prev.strategy, type },
                  }))
                }
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20 text-white">
                  <SelectItem value="round-robin">轮询调用</SelectItem>
                  <SelectItem value="weighted">权重调用</SelectItem>
                  <SelectItem value="priority">优先级调用</SelectItem>
                  <SelectItem value="failover">故障转移</SelectItem>
                  <SelectItem value="load-balance">负载均衡</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">启用故障转移</Label>
                <div className="text-white/60 text-sm">主提供商失败时自动切换</div>
              </div>
              <Switch
                checked={config.strategy.fallbackEnabled}
                onCheckedChange={(fallbackEnabled) =>
                  setConfig((prev) => ({
                    ...prev,
                    strategy: { ...prev.strategy, fallbackEnabled },
                  }))
                }
              />
            </div>
          </div>

          {/* 配置管理 */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={exportConfig}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              导出配置
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Upload className="w-4 h-4 mr-2" />
                导入配置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 提供商管理 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>API提供商管理</span>
            <Button
              onClick={addProvider}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加提供商
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {config.providers.length === 0 ? (
            <div className="text-center py-8 text-white/60">暂无配置的提供商，点击上方按钮添加</div>
          ) : (
            config.providers.map((provider) => (
              <Card key={provider.id} className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* 基本信息 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getProviderStatusIcon(provider)}
                          <Input
                            value={provider.name}
                            onChange={(e) => updateProvider(provider.id, { name: e.target.value })}
                            className="bg-white/10 border-white/20 text-white font-semibold"
                            placeholder="提供商名称"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={provider.enabled}
                            onCheckedChange={(enabled) => updateProvider(provider.id, { enabled })}
                          />
                          <Button
                            onClick={() => testProvider(provider)}
                            disabled={isTestingProvider === provider.id}
                            size="sm"
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => removeProvider(provider.id)}
                            size="sm"
                            variant="outline"
                            className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-white text-xs">类型</Label>
                          <Select
                            value={provider.type}
                            onValueChange={(type: "cloud" | "local") => updateProvider(provider.id, { type })}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="cloud">云端</SelectItem>
                              <SelectItem value="local">本地</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs">权重</Label>
                          <Input
                            type="number"
                            value={provider.weight}
                            onChange={(e) => updateProvider(provider.id, { weight: Number(e.target.value) })}
                            className="bg-white/10 border-white/20 text-white h-8"
                            min="1"
                            max="10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white text-xs">API端点</Label>
                        <Input
                          value={provider.endpoint}
                          onChange={(e) => updateProvider(provider.id, { endpoint: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="https://api.example.com/v1/chat"
                        />
                      </div>

                      <div>
                        <Label className="text-white text-xs">模型名称</Label>
                        <Input
                          value={provider.model}
                          onChange={(e) => updateProvider(provider.id, { model: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="gpt-3.5-turbo"
                        />
                      </div>
                    </div>

                    {/* 高级配置和统计 */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-white text-xs">优先级</Label>
                          <Input
                            type="number"
                            value={provider.priority}
                            onChange={(e) => updateProvider(provider.id, { priority: Number(e.target.value) })}
                            className="bg-white/10 border-white/20 text-white h-8"
                            min="1"
                            max="10"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs">超时(ms)</Label>
                          <Input
                            type="number"
                            value={provider.timeout}
                            onChange={(e) => updateProvider(provider.id, { timeout: Number(e.target.value) })}
                            className="bg-white/10 border-white/20 text-white h-8"
                            min="1000"
                            step="1000"
                          />
                        </div>
                      </div>

                      {provider.type === "cloud" && (
                        <div>
                          <Label className="text-white text-xs">API密钥</Label>
                          <Input
                            type="password"
                            value={provider.apiKey || ""}
                            onChange={(e) => updateProvider(provider.id, { apiKey: e.target.value })}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="sk-..."
                          />
                        </div>
                      )}

                      {/* 统计信息 */}
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-white text-xs font-semibold mb-2">调用统计</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-400">成功: {provider.successCount}</div>
                          <div className="text-red-400">失败: {provider.errorCount}</div>
                          <div className="text-blue-400">
                            成功率:{" "}
                            {provider.successCount + provider.errorCount > 0
                              ? ((provider.successCount / (provider.successCount + provider.errorCount)) * 100).toFixed(
                                  1,
                                )
                              : 0}
                            %
                          </div>
                          <div className="text-purple-400">
                            平均响应: {provider.avgResponseTime ? Math.round(provider.avgResponseTime) : 0}ms
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* 测试区域 */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">混合调用测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">测试提示词</Label>
                <Textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="输入测试提示词..."
                  rows={4}
                />
              </div>

              <Button
                onClick={testMixedCall}
                disabled={
                  !config.enabled || config.providers.filter((p) => p.enabled).length === 0 || !testPrompt.trim()
                }
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                测试混合调用
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

      {/* 统计概览 */}
      {stats && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              混合调用统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-white mb-1">{stats.totalCalls}</div>
                <div className="text-white/70 text-sm">总调用数</div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {stats.providers.filter((p: any) => p.enabled).length}
                </div>
                <div className="text-white/70 text-sm">活跃提供商</div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {stats.providers.reduce((sum: number, p: any) => sum + p.successCount, 0)}
                </div>
                <div className="text-white/70 text-sm">成功调用</div>
              </div>

              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">{config.strategy.type}</div>
                <div className="text-white/70 text-sm">当前策略</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-white font-semibold">提供商性能排行</div>
              {stats.providers
                .filter((p: any) => p.enabled)
                .sort((a: any, b: any) => b.successRate - a.successRate)
                .map((provider: any, index: number) => (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-white font-semibold">#{index + 1}</div>
                      <div className="text-white">{provider.name}</div>
                      <Badge
                        className={
                          provider.successRate > 0.8
                            ? "bg-green-500/20 text-green-300"
                            : provider.successRate > 0.5
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }
                      >
                        {(provider.successRate * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-white/70 text-sm">
                      {provider.avgResponseTime}ms | {provider.successCount + provider.errorCount} 调用
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
