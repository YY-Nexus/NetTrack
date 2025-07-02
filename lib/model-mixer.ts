export interface APIProvider {
  id: string
  name: string
  type: "cloud" | "local"
  endpoint: string
  apiKey?: string
  model: string
  enabled: boolean
  weight: number
  priority: number
  timeout: number
  maxRetries: number
  rateLimit: number
  lastUsed: number
  successCount: number
  errorCount: number
  avgResponseTime: number
}

export interface MixerStrategy {
  type: "round-robin" | "weighted" | "priority" | "failover" | "load-balance"
  fallbackEnabled: boolean
  maxConcurrent: number
  retryDelay: number
  healthCheckInterval: number
}

export interface MixerConfig {
  providers: APIProvider[]
  strategy: MixerStrategy
  enabled: boolean
  logging: boolean
}

export class ModelMixer {
  private config: MixerConfig
  private currentIndex = 0
  private healthCheckTimer?: NodeJS.Timeout

  constructor(config: MixerConfig) {
    this.config = config
    this.startHealthCheck()
  }

  async callAPI(prompt: string, options: any = {}): Promise<any> {
    if (!this.config.enabled) {
      throw new Error("Model mixer is disabled")
    }

    const enabledProviders = this.config.providers.filter((p) => p.enabled)
    if (enabledProviders.length === 0) {
      throw new Error("No enabled providers available")
    }

    let provider: APIProvider
    let result: any
    let lastError: Error | null = null

    switch (this.config.strategy.type) {
      case "round-robin":
        provider = this.getRoundRobinProvider(enabledProviders)
        break
      case "weighted":
        provider = this.getWeightedProvider(enabledProviders)
        break
      case "priority":
        provider = this.getPriorityProvider(enabledProviders)
        break
      case "failover":
        return this.callWithFailover(enabledProviders, prompt, options)
      case "load-balance":
        provider = this.getLoadBalancedProvider(enabledProviders)
        break
      default:
        provider = enabledProviders[0]
    }

    try {
      result = await this.callProvider(provider, prompt, options)
      this.updateProviderStats(provider, true, Date.now() - provider.lastUsed)
      return result
    } catch (error) {
      this.updateProviderStats(provider, false, 0)
      lastError = error as Error

      if (this.config.strategy.fallbackEnabled) {
        const fallbackProviders = enabledProviders.filter((p) => p.id !== provider.id)
        for (const fallbackProvider of fallbackProviders) {
          try {
            result = await this.callProvider(fallbackProvider, prompt, options)
            this.updateProviderStats(fallbackProvider, true, Date.now() - fallbackProvider.lastUsed)
            return result
          } catch (fallbackError) {
            this.updateProviderStats(fallbackProvider, false, 0)
            continue
          }
        }
      }

      throw lastError
    }
  }

  private getRoundRobinProvider(providers: APIProvider[]): APIProvider {
    const provider = providers[this.currentIndex % providers.length]
    this.currentIndex++
    return provider
  }

  private getWeightedProvider(providers: APIProvider[]): APIProvider {
    const totalWeight = providers.reduce((sum, p) => sum + p.weight, 0)
    let random = Math.random() * totalWeight

    for (const provider of providers) {
      random -= provider.weight
      if (random <= 0) {
        return provider
      }
    }

    return providers[0]
  }

  private getPriorityProvider(providers: APIProvider[]): APIProvider {
    return providers.sort((a, b) => b.priority - a.priority)[0]
  }

  private getLoadBalancedProvider(providers: APIProvider[]): APIProvider {
    // 选择响应时间最短且成功率最高的提供商
    return providers.sort((a, b) => {
      const aScore = a.successCount / (a.successCount + a.errorCount) / (a.avgResponseTime || 1)
      const bScore = b.successCount / (b.successCount + b.errorCount) / (b.avgResponseTime || 1)
      return bScore - aScore
    })[0]
  }

  private async callWithFailover(providers: APIProvider[], prompt: string, options: any): Promise<any> {
    const sortedProviders = providers.sort((a, b) => b.priority - a.priority)

    for (const provider of sortedProviders) {
      try {
        const result = await this.callProvider(provider, prompt, options)
        this.updateProviderStats(provider, true, Date.now() - provider.lastUsed)
        return result
      } catch (error) {
        this.updateProviderStats(provider, false, 0)
        if (provider === sortedProviders[sortedProviders.length - 1]) {
          throw error
        }
        continue
      }
    }
  }

  private async callProvider(provider: APIProvider, prompt: string, options: any): Promise<any> {
    provider.lastUsed = Date.now()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), provider.timeout)

    try {
      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(provider.apiKey && { Authorization: `Bearer ${provider.apiKey}` }),
        },
        body: JSON.stringify({
          model: provider.model,
          prompt,
          ...options,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  private updateProviderStats(provider: APIProvider, success: boolean, responseTime: number) {
    if (success) {
      provider.successCount++
      if (responseTime > 0) {
        provider.avgResponseTime = provider.avgResponseTime
          ? (provider.avgResponseTime + responseTime) / 2
          : responseTime
      }
    } else {
      provider.errorCount++
    }

    if (this.config.logging) {
      console.log(`Provider ${provider.name}: ${success ? "SUCCESS" : "ERROR"}, Response time: ${responseTime}ms`)
    }
  }

  private startHealthCheck() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }

    this.healthCheckTimer = setInterval(async () => {
      for (const provider of this.config.providers) {
        if (!provider.enabled) continue

        try {
          await this.callProvider(provider, "health check", { max_tokens: 1 })
          // Provider is healthy
        } catch (error) {
          console.warn(`Health check failed for provider ${provider.name}:`, error)
          // Could implement auto-disable logic here
        }
      }
    }, this.config.strategy.healthCheckInterval)
  }

  updateConfig(newConfig: Partial<MixerConfig>) {
    this.config = { ...this.config, ...newConfig }
    if (newConfig.strategy?.healthCheckInterval) {
      this.startHealthCheck()
    }
  }

  getStats() {
    return {
      providers: this.config.providers.map((p) => ({
        id: p.id,
        name: p.name,
        enabled: p.enabled,
        successCount: p.successCount,
        errorCount: p.errorCount,
        successRate: p.successCount / (p.successCount + p.errorCount) || 0,
        avgResponseTime: p.avgResponseTime,
        lastUsed: p.lastUsed,
      })),
      strategy: this.config.strategy,
      totalCalls: this.config.providers.reduce((sum, p) => sum + p.successCount + p.errorCount, 0),
    }
  }

  exportConfig(): string {
    return JSON.stringify(this.config, null, 2)
  }

  importConfig(configJson: string) {
    try {
      const newConfig = JSON.parse(configJson)
      this.updateConfig(newConfig)
      return true
    } catch (error) {
      console.error("Failed to import config:", error)
      return false
    }
  }

  destroy() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
    }
  }
}

// 默认配置
export const defaultMixerConfig: MixerConfig = {
  providers: [],
  strategy: {
    type: "round-robin",
    fallbackEnabled: true,
    maxConcurrent: 3,
    retryDelay: 1000,
    healthCheckInterval: 60000,
  },
  enabled: false,
  logging: true,
}
