// API服务函数 - 客户端调用

interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// 天气查询服务
export async function fetchWeather(city: string): Promise<APIResponse<string>> {
  try {
    const response = await fetch("/api/weather", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || "天气查询失败" }
    }
  } catch (error) {
    return { success: false, error: "网络连接错误" }
  }
}

// 新闻查询服务
export async function fetchNews(category: string): Promise<APIResponse<string>> {
  try {
    const response = await fetch("/api/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || "新闻获取失败" }
    }
  } catch (error) {
    return { success: false, error: "网络连接错误" }
  }
}

// IP查询服务
export async function fetchIPInfo(ip: string): Promise<APIResponse<string>> {
  try {
    const response = await fetch("/api/ipinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ip }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || "IP查询失败" }
    }
  } catch (error) {
    return { success: false, error: "网络连接错误" }
  }
}

// 汇率转换服务
export async function fetchCurrency(from: string, to: string, amount: number): Promise<APIResponse<string>> {
  try {
    const response = await fetch("/api/currency", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, amount }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, data: result.data }
    } else {
      return { success: false, error: result.error || "汇率转换失败" }
    }
  } catch (error) {
    return { success: false, error: "网络连接错误" }
  }
}
