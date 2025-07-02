import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json()

    if (!city) {
      return NextResponse.json({ error: "请输入城市名称" }, { status: 400 })
    }

    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API密钥未配置" }, { status: 500 })
    }

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=zh_cn`

    const response = await fetch(url)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: `未找到城市 "${city}"，请检查城市名称` }, { status: 404 })
      }
      return NextResponse.json({ error: "天气服务暂时不可用" }, { status: 500 })
    }

    const data = await response.json()

    const weatherInfo = `# 🌤️ ${data.name} 天气信息

## 📊 当前天气
• **天气状况**：${data.weather[0].description}
• **温度**：${data.main.temp}°C
• **体感温度**：${data.main.feels_like}°C
• **湿度**：${data.main.humidity}%
• **气压**：${data.main.pressure} hPa
• **风速**：${data.wind?.speed || 0} m/s

## 🌡️ 温度范围
• **最高温度**：${data.main.temp_max}°C
• **最低温度**：${data.main.temp_min}°C

## 👁️ 能见度
• **能见度**：${data.visibility ? (data.visibility / 1000).toFixed(1) + " km" : "数据不可用"}

## 🌍 地理信息
• **国家**：${data.sys.country}
• **经纬度**：${data.coord.lat}, ${data.coord.lon}

## ⏰ 更新时间
${new Date().toLocaleString("zh-CN")}

## 💡 生活建议
${getWeatherAdvice(data.main.temp, data.weather[0].main, data.main.humidity)}
`

    return NextResponse.json({ data: weatherInfo })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "天气查询服务异常" }, { status: 500 })
  }
}

function getWeatherAdvice(temp: number, condition: string, humidity: number): string {
  const advice = []

  if (temp < 0) {
    advice.push("气温较低，注意防寒保暖")
  } else if (temp > 30) {
    advice.push("气温较高，注意防暑降温")
  } else if (temp >= 20 && temp <= 25) {
    advice.push("温度适宜，适合户外活动")
  }

  if (condition.includes("Rain")) {
    advice.push("有降雨，记得携带雨具")
  } else if (condition.includes("Clear")) {
    advice.push("天气晴朗，适合出行")
  }

  if (humidity > 80) {
    advice.push("湿度较高，注意通风")
  } else if (humidity < 30) {
    advice.push("空气干燥，注意补水")
  }

  return advice.length > 0 ? advice.join("；") : "天气状况良好"
}
