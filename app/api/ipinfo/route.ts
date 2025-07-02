import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json()

    if (!ip) {
      return NextResponse.json({ error: "请输入IP地址" }, { status: 400 })
    }

    // 简单的IP地址格式验证
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipPattern.test(ip)) {
      return NextResponse.json({ error: "请输入有效的IP地址格式" }, { status: 400 })
    }

    const token = process.env.IPINFO_TOKEN
    if (!token) {
      return NextResponse.json({ error: "API密钥未配置" }, { status: 500 })
    }

    const url = `http://ipinfo.io/${ip}/json?token=${token}`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `IP地址 "${ip}" 信息未找到` }, { status: 404 })
      }
      return NextResponse.json({ error: "IP查询服务暂时不可用" }, { status: 500 })
    }

    const data = await response.json()

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }

    const ipInfo = `# 📍 IP地址查询结果

## 🌐 基本信息
• **IP地址**：${data.ip || ip}
• **主机名**：${data.hostname || "未知"}
• **城市**：${data.city || "未知"}
• **地区**：${data.region || "未知"}
• **国家**：${data.country || "未知"}
• **位置坐标**：${data.loc || "未知"}

## 🏢 网络信息
• **ISP/组织**：${data.org || "未知"}
• **时区**：${data.timezone || "未知"}
• **邮政编码**：${data.postal || "未知"}

## 📊 查询信息
• **查询时间**：${new Date().toLocaleString("zh-CN")}
• **数据来源**：IPInfo API
• **查询状态**：成功

## 🔒 隐私提醒
• IP地址可能包含敏感位置信息
• 建议保护个人IP地址隐私
• 使用VPN可以隐藏真实IP地址

## 💡 安全建议
${getSecurityAdvice(data.org, data.country)}
`

    return NextResponse.json({ data: ipInfo })
  } catch (error) {
    console.error("IP API error:", error)
    return NextResponse.json({ error: "IP查询服务异常" }, { status: 500 })
  }
}

function getSecurityAdvice(org: string, country: string): string {
  const advice = []

  if (org && org.toLowerCase().includes("cloud")) {
    advice.push("检测到云服务提供商，可能是服务器IP")
  }

  if (country && country !== "CN") {
    advice.push("IP地址来自海外，注意网络安全")
  }

  advice.push("定期检查网络安全设置")
  advice.push("避免在不安全网络中传输敏感信息")

  return advice.join("；")
}
