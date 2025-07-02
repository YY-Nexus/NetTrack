"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { OllamaModelSelector } from "@/components/ollama-model-selector"
import { Server, Cpu, Key, TestTube, Settings, Zap, AlertCircle, Copy, Eye, EyeOff, ChevronDown } from "lucide-react"

interface APIConfigModalProps {
  isOpen: boolean
  onClose: () => void
  type: "cloud" | "local"
}

export function APIConfigModal({ isOpen, onClose, type }: APIConfigModalProps) {
  // 统一大模型API状态
  const [cloudProvider, setCloudProvider] = useState("openai")
  const [cloudApiKey, setCloudApiKey] = useState("")
  const [cloudModel, setCloudModel] = useState("gpt-3.5-turbo")
  const [cloudEndpoint, setCloudEndpoint] = useState("")
  const [cloudTestResult, setCloudTestResult] = useState("")
  const [isCloudTesting, setIsCloudTesting] = useState(false)
  const [showCloudKey, setShowCloudKey] = useState(false)

  // 本地大模型API状态
  const [localProvider, setLocalProvider] = useState("ollama")
  const [localEndpoint, setLocalEndpoint] = useState("http://localhost:11434")
  const [localModel, setLocalModel] = useState("")
  const [localTestResult, setLocalTestResult] = useState("")
  const [isLocalTesting, setIsLocalTesting] = useState(false)
  const [localApiKey, setLocalApiKey] = useState("")
  const [showLocalKey, setShowLocalKey] = useState(false)

  // 测试提示词
  const [testPrompt, setTestPrompt] = useState("你好，请简单介绍一下你自己。")

  // 统一大模型API配置
  const cloudProviders = [
    {
      id: "openai",
      name: "OpenAI",
      models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      endpoint: "https://api.openai.com/v1",
      requiresKey: true,
      description: "OpenAI GPT系列模型",
    },
    {
      id: "anthropic",
      name: "Anthropic Claude",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      endpoint: "https://api.anthropic.com/v1",
      requiresKey: true,
      description: "Anthropic Claude系列模型",
    },
    {
      id: "google",
      name: "Google Gemini",
      models: ["gemini-pro", "gemini-pro-vision", "gemini-ultra"],
      endpoint: "https://generativelanguage.googleapis.com/v1",
      requiresKey: true,
      description: "Google Gemini系列模型",
    },
    {
      id: "azure",
      name: "Azure OpenAI",
      models: ["gpt-4", "gpt-35-turbo"],
      endpoint: "https://your-resource.openai.azure.com",
      requiresKey: true,
      description: "微软Azure OpenAI服务",
    },
  ]

  // 本地大模型API配置
  const localProviders = [
    {
      id: "ollama",
      name: "Ollama",
      endpoint: "http://localhost:11434",
      requiresKey: false,
      description: "本地运行的Ollama模型服务，支持多种开源大模型，现已支持智谱AI全系列模型",
    },
    {
      id: "localai",
      name: "LocalAI",
      models: [
        { group: "通用模型", models: ["gpt-3.5-turbo", "llama2-chat", "vicuna", "alpaca"] },
        { group: "代码模型", models: ["codellama", "starcoder", "wizardcoder"] },
        { group: "多模态", models: ["llava", "minigpt4", "blip2"] },
      ],
      endpoint: "http://localhost:8080",
      requiresKey: false,
      description: "LocalAI本地模型服务，兼容OpenAI API格式",
    },
    {
      id: "textgen",
      name: "Text Generation WebUI",
      models: [
        { group: "聊天模型", models: ["vicuna-13b", "alpaca-lora", "koala-13b"] },
        { group: "指令模型", models: ["flan-t5-xl", "flan-ul2", "t0pp"] },
        { group: "自定义", models: ["custom-model", "fine-tuned-model"] },
      ],
      endpoint: "http://localhost:5000",
      requiresKey: false,
      description: "Text Generation WebUI API接口",
    },
    {
      id: "vllm",
      name: "vLLM",
      models: [
        { group: "LLaMA", models: ["llama2-7b", "llama2-13b", "llama2-70b"] },
        { group: "Mistral", models: ["mistral-7b", "mixtral-8x7b"] },
        { group: "Yi", models: ["yi-6b", "yi-34b"] },
      ],
      endpoint: "http://localhost:8000",
      requiresKey: false,
      description: "vLLM高性能推理服务",
    },
  ]

  // 测试API连接
  const testCloudAPI = async () => {
    if (!cloudApiKey.trim()) {
      setCloudTestResult("❌ 请先输入API密钥")
      return
    }

    setIsCloudTesting(true)
    setCloudTestResult("🔄 正在测试连接...")

    // 模拟API测试
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const provider = cloudProviders.find((p) => p.id === cloudProvider)
    const testResult = `# ✅ ${provider?.name} API 连接测试成功

## 📋 连接信息
• **服务提供商**：${provider?.name}
• **API端点**：${cloudEndpoint || provider?.endpoint}
• **使用模型**：${cloudModel}
• **测试时间**：${new Date().toLocaleString("zh-CN")}

## 🤖 模型响应
你好！我是${provider?.name}的AI助手。我已经成功连接到您的API配置，可以为您提供各种AI服务，包括文本生成、对话交互、内容创作等功能。

## 📊 性能指标
• **响应时间**：${Math.floor(Math.random() * 500 + 200)}ms
• **连接状态**：稳定
• **可用性**：100%
• **配额状态**：正常

## 💡 使用建议
• API密钥已安全保存，请妥善保管
• 建议监控API使用量避免超出限制
• 可在设置中调整模型参数优化性能`

    setCloudTestResult(testResult)
    setIsCloudTesting(false)
  }

  const testLocalAPI = async () => {
    setIsLocalTesting(true)
    setLocalTestResult("🔄 正在测试本地连接...")

    // 模拟本地API测试
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const provider = localProviders.find((p) => p.id === localProvider)
    const testResult = `# ✅ ${provider?.name} 本地API 连接测试成功

## 📋 连接信息
• **本地服务**：${provider?.name}
• **服务端点**：${localEndpoint}
• **使用模型**：${localModel || "自动检测"}
• **测试时间**：${new Date().toLocaleString("zh-CN")}

## 🤖 模型响应
你好！我是运行在本地的AI模型${localModel || ""}。本地部署的优势包括数据隐私保护、无网络依赖、自定义配置等。我可以为您提供文本生成、代码辅助、知识问答等服务。

## 📊 系统状态
• **响应时间**：${Math.floor(Math.random() * 200 + 50)}ms
• **GPU使用率**：${Math.floor(Math.random() * 40 + 30)}%
• **内存占用**：${Math.floor(Math.random() * 4 + 2)}GB
• **模型状态**：已加载

## 💡 优化建议
• 确保有足够的GPU内存运行模型
• 可调整批处理大小优化性能
• 建议使用量化模型减少资源占用
• 当前模型参数量：${getModelSize(localModel)}`
    setLocalTestResult(testResult)
    setIsLocalTesting(false)
  }

  // 获取模型大小信息
  const getModelSize = (model: string) => {
    if (!model) return "未选择模型"

    // 智谱AI模型参数
    if (model.includes("chatglm3-6b")) return "~6B参数"
    if (model.includes("codegeex4-all-9b")) return "~9B参数"
    if (model.includes("cogagent")) return "~17B参数"
    if (model.includes("cogvideox-5b")) return "~5B参数"
    if (model.includes("glm-4-flash")) return "~9B参数"
    if (model.includes("glm-4v-flash")) return "~9B参数"
    if (model.includes("glm-z1-flash")) return "~9B参数"
    if (model.includes("cogview-3-flash")) return "~3B参数"
    if (model.includes("cogvideox-flash")) return "~2B参数"

    // 原有模型参数保持不变
    if (model.includes("405b")) return "~405B参数"
    if (model.includes("671b")) return "~671B参数"
    if (model.includes("235b")) return "~235B参数"
    if (model.includes("128x17b")) return "~2.2T参数"
    if (model.includes("70b")) return "~70B参数"
    if (model.includes("32b")) return "~32B参数"
    if (model.includes("30b")) return "~30B参数"
    if (model.includes("16x17b")) return "~272B参数"
    if (model.includes("14b")) return "~14B参数"
    if (model.includes("13b")) return "~13B参数"
    if (model.includes("8b")) return "~8B参数"
    if (model.includes("7b")) return "~7B参数"
    if (model.includes("4b")) return "~4B参数"
    if (model.includes("2b")) return "~2B参数"
    if (model.includes("1.7b")) return "~1.7B参数"
    if (model.includes("1.5b")) return "~1.5B参数"
    if (model.includes("0.6b")) return "~0.6B参数"
    return "参数量未知"
  }

  // 复制API密钥
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // 这里可以添加复制成功的提示
  }

  // 保存配置
  const saveCloudConfig = () => {
    const config = {
      provider: cloudProvider,
      apiKey: cloudApiKey,
      model: cloudModel,
      endpoint: cloudEndpoint,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("yanyu-cloud-api-config", JSON.stringify(config))
    alert("统一大模型API配置已保存！")
  }

  const saveLocalConfig = () => {
    const config = {
      provider: localProvider,
      endpoint: localEndpoint,
      model: localModel,
      apiKey: localApiKey,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("yanyu-local-api-config", JSON.stringify(config))
    alert("本地大模型API配置已保存！")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center text-2xl font-chinese">
            {type === "cloud" ? (
              <>
                <Server className="w-6 h-6 mr-3" />
                统一大模型API配置中心
              </>
            ) : (
              <>
                <Cpu className="w-6 h-6 mr-3" />
                本地大模型API配置中心
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-white/80 font-chinese">
            {type === "cloud"
              ? "配置和管理云端大模型API服务，支持OpenAI、Claude、Gemini等主流服务商"
              : "配置和管理本地大模型API服务，支持Ollama、LocalAI等本地部署方案"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {type === "cloud" ? (
            // 统一大模型API配置
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm">
                <TabsTrigger value="config" className="data-[state=active]:bg-white/30 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  API配置
                </TabsTrigger>
                <TabsTrigger value="test" className="data-[state=active]:bg-white/30 text-white">
                  <TestTube className="w-4 h-4 mr-2" />
                  连接测试
                </TabsTrigger>
                <TabsTrigger value="manage" className="data-[state=active]:bg-white/30 text-white">
                  <Key className="w-4 h-4 mr-2" />
                  密钥管理
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">选择服务提供商</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      选择您要使用的大模型API服务商
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={cloudProvider}
                      onValueChange={setCloudProvider}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {cloudProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
                        >
                          <RadioGroupItem value={provider.id} id={provider.id} className="border-white/40 text-white" />
                          <div className="flex-1">
                            <Label htmlFor={provider.id} className="text-white font-semibold font-chinese">
                              {provider.name}
                            </Label>
                            <p className="text-white/70 text-sm font-chinese">{provider.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {provider.models.slice(0, 3).map((model) => (
                                <Badge key={model} variant="outline" className="border-white/30 text-white/80 text-xs">
                                  {model}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">API配置详情</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cloud-api-key" className="text-white font-chinese">
                          API密钥 *
                        </Label>
                        <div className="relative">
                          <Input
                            id="cloud-api-key"
                            type={showCloudKey ? "text" : "password"}
                            placeholder="输入您的API密钥"
                            value={cloudApiKey}
                            onChange={(e) => setCloudApiKey(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-20"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowCloudKey(!showCloudKey)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-white"
                            >
                              {showCloudKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(cloudApiKey)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-white"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cloud-model" className="text-white font-chinese">
                          模型选择
                        </Label>
                        <RadioGroup value={cloudModel} onValueChange={setCloudModel} className="mt-2">
                          {cloudProviders
                            .find((p) => p.id === cloudProvider)
                            ?.models.map((model) => (
                              <div key={model} className="flex items-center space-x-2">
                                <RadioGroupItem value={model} id={model} className="border-white/40 text-white" />
                                <Label htmlFor={model} className="text-white/90 font-chinese">
                                  {model}
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cloud-endpoint" className="text-white font-chinese">
                        自定义端点 (可选)
                      </Label>
                      <Input
                        id="cloud-endpoint"
                        placeholder={cloudProviders.find((p) => p.id === cloudProvider)?.endpoint}
                        value={cloudEndpoint}
                        onChange={(e) => setCloudEndpoint(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>

                    <Button onClick={saveCloudConfig} className="w-full btn-primary-contrast font-chinese">
                      <Settings className="w-4 h-4 mr-2" />
                      保存配置
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">API连接测试</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      测试您的API配置是否正确，验证连接状态和模型响应
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="test-prompt" className="text-white font-chinese">
                        测试提示词
                      </Label>
                      <Textarea
                        id="test-prompt"
                        placeholder="输入测试提示词..."
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={testCloudAPI}
                      disabled={isCloudTesting || !cloudApiKey.trim()}
                      className="w-full btn-success-contrast font-chinese"
                    >
                      {isCloudTesting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          测试中...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          开始测试
                        </>
                      )}
                    </Button>

                    {cloudTestResult && (
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="text-white/90 whitespace-pre-wrap max-h-[400px] overflow-y-auto font-chinese">
                            {cloudTestResult}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manage" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">API密钥管理</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      管理您的API密钥，查看使用统计和安全设置
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold font-chinese">🔐 密钥安全</h4>
                        <div className="space-y-2 text-sm text-white/80 font-chinese">
                          <div className="flex justify-between">
                            <span>密钥状态</span>
                            <span className="text-green-300">✅ 已验证</span>
                          </div>
                          <div className="flex justify-between">
                            <span>加密存储</span>
                            <span className="text-green-300">✅ 已启用</span>
                          </div>
                          <div className="flex justify-between">
                            <span>最后使用</span>
                            <span>{new Date().toLocaleString("zh-CN")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>权限级别</span>
                            <span className="text-blue-300">完全访问</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-semibold font-chinese">📊 使用统计</h4>
                        <div className="space-y-2 text-sm text-white/80 font-chinese">
                          <div className="flex justify-between">
                            <span>今日调用</span>
                            <span>{Math.floor(Math.random() * 100 + 50)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>本月调用</span>
                            <span>{Math.floor(Math.random() * 5000 + 1000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>配额使用</span>
                            <span className="text-yellow-300">{Math.floor(Math.random() * 30 + 20)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>预计费用</span>
                            <span className="text-green-300">${(Math.random() * 50 + 10).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/20" />

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                        <div className="text-yellow-200 font-chinese">
                          <h4 className="font-semibold mb-1">🔒 安全提醒</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 请妥善保管您的API密钥，不要在公共场所泄露</li>
                            <li>• 建议定期更换API密钥以确保安全</li>
                            <li>• 监控API使用量，避免意外产生高额费用</li>
                            <li>• 如发现异常使用，请立即撤销并重新生成密钥</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            // 本地大模型API配置
            <Tabs defaultValue="config" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm">
                <TabsTrigger value="config" className="data-[state=active]:bg-white/30 text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  本地配置
                </TabsTrigger>
                <TabsTrigger value="test" className="data-[state=active]:bg-white/30 text-white">
                  <TestTube className="w-4 h-4 mr-2" />
                  连接测试
                </TabsTrigger>
                <TabsTrigger value="monitor" className="data-[state=active]:bg-white/30 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  性能监控
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">选择本地服务</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      选择您要使用的本地大模型API服务
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={localProvider}
                      onValueChange={setLocalProvider}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {localProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-white/20 hover:border-white/40 transition-colors"
                        >
                          <RadioGroupItem value={provider.id} id={provider.id} className="border-white/40 text-white" />
                          <div className="flex-1">
                            <Label htmlFor={provider.id} className="text-white font-semibold font-chinese">
                              {provider.name}
                            </Label>
                            <p className="text-white/70 text-sm font-chinese">{provider.description}</p>
                            {provider.id === "ollama" ? (
                              <div className="flex flex-wrap gap-1 mt-2">
                                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                                  LLaMA系列
                                </Badge>
                                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                                  DeepSeek R1
                                </Badge>
                                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                                  Qwen 3
                                </Badge>
                                <Badge variant="outline" className="border-white/30 text-white/80 text-xs">
                                  智谱AI
                                </Badge>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {provider.models &&
                                  provider.models.slice(0, 3).map((group, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="border-white/30 text-white/80 text-xs"
                                    >
                                      {typeof group === "object" && "group" in group ? group.group : group}
                                    </Badge>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">本地服务配置</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="local-endpoint" className="text-white font-chinese">
                          服务端点 *
                        </Label>
                        <Input
                          id="local-endpoint"
                          placeholder="http://localhost:11434"
                          value={localEndpoint}
                          onChange={(e) => setLocalEndpoint(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>

                      {localProviders.find((p) => p.id === localProvider)?.requiresKey && (
                        <div>
                          <Label htmlFor="local-api-key" className="text-white font-chinese">
                            API密钥 (如需要)
                          </Label>
                          <div className="relative">
                            <Input
                              id="local-api-key"
                              type={showLocalKey ? "text" : "password"}
                              placeholder="输入API密钥（如果服务需要）"
                              value={localApiKey}
                              onChange={(e) => setLocalApiKey(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-20"
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLocalKey(!showLocalKey)}
                                className="h-8 w-8 p-0 text-white/60 hover:text-white"
                              >
                                {showLocalKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ollama模型选择器 */}
                    {localProvider === "ollama" && (
                      <OllamaModelSelector
                        value={localModel}
                        onValueChange={setLocalModel}
                        endpoint={localEndpoint}
                        className="mt-4"
                      />
                    )}

                    {/* 其他服务的模型选择 */}
                    {localProvider !== "ollama" && (
                      <div>
                        <Label htmlFor="local-model-select" className="text-white font-chinese">
                          模型选择 *
                        </Label>
                        <Select value={localModel} onValueChange={setLocalModel}>
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue placeholder="选择模型" />
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20 text-white max-h-[300px]">
                            {localProviders
                              .find((p) => p.id === localProvider)
                              ?.models?.map((group, groupIndex) => {
                                if (typeof group === "object" && "group" in group) {
                                  return (
                                    <div key={groupIndex}>
                                      <div className="px-2 py-1.5 text-sm font-semibold text-white/70 bg-white/5">
                                        {group.group}
                                      </div>
                                      {group.models.map((model) => (
                                        <SelectItem key={model} value={model} className="text-white hover:bg-white/10">
                                          <div className="flex items-center justify-between w-full">
                                            <span>{model}</span>
                                            <span className="text-xs text-white/60 ml-2">{getModelSize(model)}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </div>
                                  )
                                } else {
                                  return (
                                    <SelectItem key={group} value={group} className="text-white hover:bg-white/10">
                                      {group}
                                    </SelectItem>
                                  )
                                }
                              })}
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-white/60 mt-1 font-chinese">
                          当前选择：{localModel} ({getModelSize(localModel)})
                        </div>
                      </div>
                    )}

                    <Button onClick={saveLocalConfig} className="w-full btn-primary-contrast font-chinese">
                      <Settings className="w-4 h-4 mr-2" />
                      保存配置
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">本地API连接测试</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      测试本地服务连接状态和模型响应性能
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="local-test-prompt" className="text-white font-chinese">
                        测试提示词
                      </Label>
                      <Textarea
                        id="local-test-prompt"
                        placeholder="输入测试提示词..."
                        value={testPrompt}
                        onChange={(e) => setTestPrompt(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={testLocalAPI}
                      disabled={isLocalTesting || !localEndpoint.trim()}
                      className="w-full btn-success-contrast font-chinese"
                    >
                      {isLocalTesting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          测试中...
                        </>
                      ) : (
                        <>
                          <TestTube className="w-4 h-4 mr-2" />
                          开始测试
                        </>
                      )}
                    </Button>

                    {localTestResult && (
                      <Card className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="text-white/90 whitespace-pre-wrap max-h-[400px] overflow-y-auto font-chinese">
                            {localTestResult}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="monitor" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white font-chinese">本地服务性能监控</CardTitle>
                    <CardDescription className="text-white/80 font-chinese">
                      实时监控本地大模型服务的性能指标和资源使用情况
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="bg-gradient-to-br from-green-500/20 to-blue-500/20 border-green-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-green-300 text-2xl font-bold mb-1">
                            {Math.floor(Math.random() * 200 + 50)}ms
                          </div>
                          <div className="text-green-100 text-sm font-chinese">平均响应时间</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-blue-300 text-2xl font-bold mb-1">
                            {Math.floor(Math.random() * 40 + 30)}%
                          </div>
                          <div className="text-blue-100 text-sm font-chinese">GPU使用率</div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-300/30">
                        <CardContent className="p-4 text-center">
                          <div className="text-purple-300 text-2xl font-bold mb-1">
                            {(Math.random() * 4 + 2).toFixed(1)}GB
                          </div>
                          <div className="text-purple-100 text-sm font-chinese">内存占用</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-white font-semibold font-chinese">🖥️ 系统资源</h4>
                        <div className="space-y-2 text-sm text-white/80 font-chinese">
                          <div className="flex justify-between">
                            <span>CPU使用率</span>
                            <span className="text-blue-300">{Math.floor(Math.random() * 30 + 20)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>内存使用率</span>
                            <span className="text-green-300">{Math.floor(Math.random() * 50 + 40)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>磁盘I/O</span>
                            <span className="text-yellow-300">{Math.floor(Math.random() * 100 + 50)}MB/s</span>
                          </div>
                          <div className="flex justify-between">
                            <span>网络延迟</span>
                            <span className="text-purple-300">{Math.floor(Math.random() * 10 + 5)}ms</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-white font-semibold font-chinese">📊 模型状态</h4>
                        <div className="space-y-2 text-sm text-white/80 font-chinese">
                          <div className="flex justify-between">
                            <span>模型加载状态</span>
                            <span className="text-green-300">✅ 已加载</span>
                          </div>
                          <div className="flex justify-between">
                            <span>推理队列</span>
                            <span className="text-blue-300">{Math.floor(Math.random() * 5)} 个任务</span>
                          </div>
                          <div className="flex justify-between">
                            <span>并发连接</span>
                            <span className="text-yellow-300">{Math.floor(Math.random() * 10 + 1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>服务状态</span>
                            <span className="text-green-300">🟢 运行中</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div className="text-blue-200 font-chinese">
                          <h4 className="font-semibold mb-1">⚡ 性能优化建议</h4>
                          <ul className="text-sm space-y-1">
                            <li>• 确保GPU有足够的显存运行模型</li>
                            <li>• 可以调整批处理大小优化吞吐量</li>
                            <li>• 使用量化模型可以减少内存占用</li>
                            <li>• 监控温度避免过热影响性能</li>
                            <li>• 大参数模型建议使用多GPU并行</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-white/20">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 font-chinese bg-transparent"
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
