// Ollama API服务 - 自动识别本地模型

export interface OllamaModel {
  name: string
  model: string
  size: number
  digest: string
  details: {
    parent_model: string
    format: string
    family: string
    families: string[]
    parameter_size: string
    quantization_level: string
  }
  expires_at: string
  size_vram: number
}

export interface OllamaListResponse {
  models: OllamaModel[]
}

export interface OllamaVersionResponse {
  version: string
}

export interface OllamaStatusResponse {
  status: "running" | "stopped" | "error"
  version?: string
  models_count?: number
}

class OllamaService {
  private baseUrl: string
  private timeout: number

  constructor(baseUrl = "http://localhost:11434", timeout = 5000) {
    this.baseUrl = baseUrl
    this.timeout = timeout
  }

  // 检查Ollama服务状态
  async checkStatus(): Promise<OllamaStatusResponse> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data: OllamaVersionResponse = await response.json()
        const modelsResponse = await this.listModels()

        return {
          status: "running",
          version: data.version,
          models_count: modelsResponse.models?.length || 0,
        }
      } else {
        return { status: "error" }
      }
    } catch (error) {
      console.error("Ollama status check failed:", error)
      return { status: "stopped" }
    }
  }

  // 获取本地已安装的模型列表
  async listModels(): Promise<OllamaListResponse> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data: OllamaListResponse = await response.json()
        return data
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error("Failed to fetch Ollama models:", error)
      return { models: [] }
    }
  }

  // 格式化模型大小
  formatModelSize(bytes: number): string {
    if (bytes === 0) return "未知大小"

    const units = ["B", "KB", "MB", "GB", "TB"]
    const k = 1024
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`
  }

  // 获取模型参数量
  getModelParameters(modelName: string): string {
    const name = modelName.toLowerCase()

    // 智谱AI模型参数
    if (name.includes("chatglm3-6b")) return "~6B参数"
    if (name.includes("codegeex4-all-9b")) return "~9B参数"
    if (name.includes("cogagent")) return "~17B参数"
    if (name.includes("cogvideox-5b")) return "~5B参数"
    if (name.includes("glm-4-flash")) return "~9B参数"
    if (name.includes("glm-4v-flash")) return "~9B参数"
    if (name.includes("glm-z1-flash")) return "~9B参数"
    if (name.includes("cogview-3-flash")) return "~3B参数"
    if (name.includes("cogvideox-flash")) return "~2B参数"

    // LLaMA系列
    if (name.includes("405b")) return "~405B参数"
    if (name.includes("671b")) return "~671B参数"
    if (name.includes("235b")) return "~235B参数"
    if (name.includes("128x17b")) return "~2.2T参数"
    if (name.includes("70b")) return "~70B参数"
    if (name.includes("32b")) return "~32B参数"
    if (name.includes("30b")) return "~30B参数"
    if (name.includes("16x17b")) return "~272B参数"
    if (name.includes("14b")) return "~14B参数"
    if (name.includes("13b")) return "~13B参数"
    if (name.includes("8b")) return "~8B参数"
    if (name.includes("7b")) return "~7B参数"
    if (name.includes("4b")) return "~4B参数"
    if (name.includes("2b")) return "~2B参数"
    if (name.includes("1.7b")) return "~1.7B参数"
    if (name.includes("1.5b")) return "~1.5B参数"
    if (name.includes("0.6b")) return "~0.6B参数"

    return "参数量未知"
  }

  // 获取模型类型/分类
  getModelCategory(modelName: string): string {
    const name = modelName.toLowerCase()

    // 智谱AI分类
    if (name.includes("chatglm") || name.includes("glm-4-flash") || name.includes("glm-z1-flash")) {
      return "智谱AI - 对话模型"
    }
    if (name.includes("codegeex")) {
      return "智谱AI - 代码模型"
    }
    if (name.includes("cogagent") || name.includes("glm-4v-flash")) {
      return "智谱AI - 多模态"
    }
    if (name.includes("cogvideox")) {
      return "智谱AI - 视频生成"
    }
    if (name.includes("cogview")) {
      return "智谱AI - 图像生成"
    }

    // LLaMA系列
    if (name.includes("llama")) {
      if (name.includes("llama4")) return "LLaMA 4"
      if (name.includes("llama3.3")) return "LLaMA 3.3"
      if (name.includes("llama3.1")) return "LLaMA 3.1"
      if (name.includes("llama3")) return "LLaMA 3"
      if (name.includes("llama2")) return "LLaMA 2"
      return "LLaMA"
    }

    // DeepSeek系列
    if (name.includes("deepseek-r1")) return "DeepSeek R1"
    if (name.includes("deepseek-coder")) return "DeepSeek Coder"
    if (name.includes("deepseek")) return "DeepSeek"

    // Qwen系列
    if (name.includes("qwen3")) return "Qwen 3"
    if (name.includes("qwen2")) return "Qwen 2"
    if (name.includes("qwen")) return "Qwen"

    // Gemma系列
    if (name.includes("gemma3n")) return "Gemma 3N"
    if (name.includes("gemma")) return "Gemma"

    // 其他常见模型
    if (name.includes("mistral")) return "Mistral"
    if (name.includes("mixtral")) return "Mixtral"
    if (name.includes("phi")) return "Phi"
    if (name.includes("yi")) return "Yi"
    if (name.includes("baichuan")) return "Baichuan"
    if (name.includes("internlm")) return "InternLM"
    if (name.includes("chatglm")) return "ChatGLM"

    return "其他模型"
  }

  // 获取推荐内存
  getRecommendedMemory(modelName: string): string {
    const name = modelName.toLowerCase()

    if (name.includes("405b") || name.includes("671b")) return "≥200GB"
    if (name.includes("70b") || name.includes("128x17b")) return "≥40GB"
    if (name.includes("32b") || name.includes("30b")) return "≥20GB"
    if (name.includes("cogagent")) return "≥12GB"
    if (name.includes("13b") || name.includes("14b") || name.includes("codegeex4-all-9b") || name.includes("glm-4"))
      return "≥8GB"
    if (name.includes("7b") || name.includes("8b") || name.includes("chatglm3-6b") || name.includes("cogvideox-5b"))
      return "≥4GB"
    if (name.includes("cogview-3-flash") || name.includes("cogvideox-flash")) return "≥2GB"

    return "≥2GB"
  }

  // 测试模型连接
  async testModel(
    modelName: string,
    prompt = "你好",
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          prompt: prompt,
          stream: false,
        }),
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return {
          success: true,
          response: data.response || "模型响应成功",
        }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误",
      }
    }
  }

  // 更新服务端点
  updateEndpoint(newBaseUrl: string) {
    this.baseUrl = newBaseUrl
  }
}

// 导出单例实例
export const ollamaService = new OllamaService()

// 导出类以便创建自定义实例
export { OllamaService }
