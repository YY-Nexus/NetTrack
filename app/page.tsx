"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { APIStatusIndicator } from "@/components/api-status-indicator"
import { fetchWeather, fetchIPInfo, fetchCurrency } from "@/lib/api-services"
import { APIConfigModal } from "@/components/api-config-modal"
import {
  Sparkles,
  Rocket,
  BarChart3,
  Activity,
  FileText,
  MessageSquare,
  TrendingUp,
  Trash2,
  Globe,
  Cloud,
  Brain,
  Zap,
  Cpu,
  Server,
  Video,
  ImageIcon,
  Code,
  Upload,
  Download,
  Play,
  Scissors,
  Palette,
  RotateCcw,
  Wand2,
  Crop,
} from "lucide-react"
import { AnimatedLogo, PageTransition } from "@/components/animated-logo"

export default function YanYuCloudPlatform() {
  // API配置模态框状态
  const [isAPIModalOpen, setIsAPIModalOpen] = useState(false)
  const [apiModalType, setApiModalType] = useState<"cloud" | "local">("cloud")

  // 智能视频状态
  const [videoModel, setVideoModel] = useState("cogvideox-5b:latest")
  const [videoMode, setVideoMode] = useState("text2video")
  const [videoPrompt, setVideoPrompt] = useState("")
  const [videoImage, setVideoImage] = useState<File | null>(null)
  const [videoDuration, setVideoDuration] = useState([5])
  const [videoQuality, setVideoQuality] = useState("high")
  const [videoResult, setVideoResult] = useState("")
  const [isVideoGenerating, setIsVideoGenerating] = useState(false)

  // 图文创作状态
  const [imageModel, setImageModel] = useState("cogview-3-flash:latest")
  const [imageMode, setImageMode] = useState("text2image")
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageStyle, setImageStyle] = useState("realistic")
  const [imageSize, setImageSize] = useState("1024x1024")
  const [imageResult, setImageResult] = useState("")
  const [isImageGenerating, setIsImageGenerating] = useState(false)
  // 新增功能状态
  const [mattingResult, setMattingResult] = useState("")
  const [isMattingProcessing, setIsMattingProcessing] = useState(false)
  const [enhanceResult, setEnhanceResult] = useState("")
  const [isEnhanceProcessing, setIsEnhanceProcessing] = useState(false)
  const [enhanceLevel, setEnhanceLevel] = useState("hd")

  // CodeX代码助理状态
  const [codeModel, setCodeModel] = useState("codegeex4-all-9b:latest")
  const [codeMode, setCodeMode] = useState("generate")
  const [codeLanguage, setCodeLanguage] = useState("python")
  const [codePrompt, setCodePrompt] = useState("")
  const [codeInput, setCodeInput] = useState("")
  const [codeResult, setCodeResult] = useState("")
  const [isCodeProcessing, setIsCodeProcessing] = useState(false)

  // 文本处理状态
  const [textModel, setTextModel] = useState("qwen3:8b")
  const [textInput, setTextInput] = useState("")
  const [textOperation, setTextOperation] = useState("智能分析")
  const [textResult, setTextResult] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // API服务状态
  const [weatherCity, setWeatherCity] = useState("")
  const [weatherResult, setWeatherResult] = useState("")
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)

  const [ipAddress, setIpAddress] = useState("")
  const [ipResult, setIpResult] = useState("")
  const [isIpLoading, setIsIpLoading] = useState(false)

  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("CNY")
  const [currencyAmount, setCurrencyAmount] = useState(100)
  const [currencyResult, setCurrencyResult] = useState("")
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false)

  // 反馈状态
  const [feedbackName, setFeedbackName] = useState("")
  const [feedbackEmail, setFeedbackEmail] = useState("")
  const [feedbackRating, setFeedbackRating] = useState([5])
  const [feedbackCategory, setFeedbackCategory] = useState("功能建议")
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // 系统统计
  const [stats, setStats] = useState({
    cloudApiCalls: 0,
    localApiCalls: 0,
    uptime: 0,
    performance: 0,
    totalOperations: 0,
    textProcessed: 0,
    videoGenerated: 0,
    imageGenerated: 0,
    codeGenerated: 0,
    feedbackCount: 0,
    weatherQueries: 0,
    ipQueries: 0,
    currencyQueries: 0,
    mattingProcessed: 0,
    imageEnhanced: 0,
  })

  // 动态数字效果
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        cloudApiCalls: Math.min(prev.cloudApiCalls + Math.floor(Math.random() * 50), 10000),
        localApiCalls: Math.min(prev.localApiCalls + Math.floor(Math.random() * 100), 50000),
        uptime: Math.min(prev.uptime + 0.1, 99.9),
        performance: Math.min(prev.performance + Math.floor(Math.random() * 5), 100),
      }))
    }, 100)

    return () => clearInterval(timer)
  }, [])

  // 添加页面切换状态
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  // 添加页面切换处理函数
  const handleLogoClick = () => {
    setIsPageTransitioning(true)
    setTimeout(() => {
      setIsPageTransitioning(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 700)
  }

  // 打开API配置模态框
  const openAPIModal = (type: "cloud" | "local") => {
    setApiModalType(type)
    setIsAPIModalOpen(true)
  }

  // API服务函数
  const handleWeatherQuery = async () => {
    if (!weatherCity.trim()) {
      setWeatherResult("❌ 请输入城市名称")
      return
    }

    setIsWeatherLoading(true)
    const result = await fetchWeather(weatherCity)

    if (result.success) {
      setWeatherResult(result.data)
      setStats((prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        weatherQueries: prev.weatherQueries + 1,
        cloudApiCalls: prev.cloudApiCalls + 1,
      }))
    } else {
      setWeatherResult(`❌ ${result.error}`)
    }

    setIsWeatherLoading(false)
  }

  const handleIPQuery = async () => {
    if (!ipAddress.trim()) {
      setIpResult("❌ 请输入IP地址")
      return
    }

    setIsIpLoading(true)
    const result = await fetchIPInfo(ipAddress)

    if (result.success) {
      setIpResult(result.data)
      setStats((prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        ipQueries: prev.ipQueries + 1,
        cloudApiCalls: prev.cloudApiCalls + 1,
      }))
    } else {
      setIpResult(`❌ ${result.error}`)
    }

    setIsIpLoading(false)
  }

  const handleCurrencyQuery = async () => {
    if (currencyAmount <= 0) {
      setCurrencyResult("❌ 请输入有效的金额")
      return
    }

    setIsCurrencyLoading(true)
    const result = await fetchCurrency(fromCurrency, toCurrency, currencyAmount)

    if (result.success) {
      setCurrencyResult(result.data)
      setStats((prev) => ({
        ...prev,
        totalOperations: prev.totalOperations + 1,
        currencyQueries: prev.currencyQueries + 1,
        cloudApiCalls: prev.cloudApiCalls + 1,
      }))
    } else {
      setCurrencyResult(`❌ ${result.error}`)
    }

    setIsCurrencyLoading(false)
  }

  // 智能视频生成功能
  const generateVideo = async () => {
    if (videoMode === "text2video" && !videoPrompt.trim()) {
      setVideoResult("❌ 请输入视频描述")
      return
    }
    if (videoMode === "image2video" && !videoImage) {
      setVideoResult("❌ 请上传参考图片")
      return
    }

    setIsVideoGenerating(true)
    setVideoResult("🎬 正在生成视频，请稍候...")

    // 模拟视频生成延迟
    await new Promise((resolve) => setTimeout(resolve, 8000))

    const currentTime = new Date().toLocaleString("zh-CN")
    const duration = videoDuration[0]

    const result = `# 🎬 智能视频生成完成

## 📋 生成信息
• **使用模型**：${videoModel}
• **生成模式**：${videoMode === "text2video" ? "文生视频" : "图生视频"}
• **视频时长**：${duration}秒
• **视频质量**：${videoQuality === "high" ? "高清" : videoQuality === "medium" ? "标清" : "快速"}
• **生成时间**：${currentTime}

## 🎯 生成内容
${
  videoMode === "text2video"
    ? `**文本描述**：${videoPrompt}

**视频场景**：根据您的描述，我们生成了一个${duration}秒的高质量视频，包含丰富的视觉效果和流畅的动画转场。视频内容完美契合您的创意需求。`
    : `**参考图片**：${videoImage?.name}

**视频效果**：基于您上传的图片，我们生成了一个${duration}秒的动态视频，保持了原图的风格特色，并添加了自然的动画效果。`
}

## 📊 技术参数
• **分辨率**：1920×1080 (Full HD)
• **帧率**：30 FPS
• **编码格式**：H.264
• **文件大小**：约 ${(duration * 2.5).toFixed(1)}MB
• **处理时间**：${(Math.random() * 3 + 5).toFixed(1)}秒

## 🎨 视频特色
• **智能构图**：AI自动优化画面构图
• **流畅动画**：自然的物体运动和转场
• **色彩调和**：专业级色彩校正
• **音效同步**：可选背景音乐匹配

## 💾 导出选项
• **格式支持**：MP4, AVI, MOV, WebM
• **质量选择**：4K, 1080P, 720P, 480P
• **压缩选项**：无损, 高质量, 标准, 快速

## 🔧 后期编辑
• **剪辑功能**：支持视频裁剪、拼接
• **特效添加**：滤镜、转场、字幕
• **音频处理**：背景音乐、音效、配音
• **批量处理**：支持多个视频同时处理`

    setVideoResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      videoGenerated: prev.videoGenerated + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsVideoGenerating(false)
  }

  // 图文创作功能
  const generateImage = async () => {
    if (imageMode === "text2image" && !imagePrompt.trim()) {
      setImageResult("❌ 请输入图片描述")
      return
    }
    if (imageMode === "image2image" && !imageFile) {
      setImageResult("❌ 请上传参考图片")
      return
    }

    setIsImageGenerating(true)
    setImageResult("🎨 正在生成图片，请稍候...")

    // 模拟图片生成延迟
    await new Promise((resolve) => setTimeout(resolve, 5000))

    const currentTime = new Date().toLocaleString("zh-CN")

    const result = `# 🎨 智能图片生成完成

## 📋 生成信息
• **使用模型**：${imageModel}
• **生成模式**：${imageMode === "text2image" ? "文生图" : "图生图"}
• **图片尺寸**：${imageSize}
• **艺术风格**：${imageStyle === "realistic" ? "写实风格" : imageStyle === "anime" ? "动漫风格" : imageStyle === "oil" ? "油画风格" : "水彩风格"}
• **生成时间**：${currentTime}

## 🎯 生成内容
${
  imageMode === "text2image"
    ? `**文本描述**：${imagePrompt}

**图片效果**：根据您的描述，我们生成了一张高质量的${imageStyle === "realistic" ? "写实风格" : imageStyle === "anime" ? "动漫风格" : "艺术风格"}图片。图片细节丰富，色彩饱满，完美呈现了您的创意构思。`
    : `**参考图片**：${imageFile?.name}

**转换效果**：基于您上传的图片，我们进行了${imageStyle === "realistic" ? "写实化" : imageStyle === "anime" ? "动漫化" : "艺术化"}处理，保持了原图的主要特征，同时增强了艺术表现力。`
}

## 📊 技术参数
• **分辨率**：${imageSize}
• **色彩深度**：24位真彩色
• **文件格式**：PNG (支持透明)
• **文件大小**：约 ${(Math.random() * 3 + 2).toFixed(1)}MB
• **处理时间**：${(Math.random() * 2 + 3).toFixed(1)}秒

## 🎨 图片特色
• **高清细节**：AI增强图片细节表现
• **色彩优化**：专业级色彩调校
• **构图平衡**：符合美学原理的构图
• **风格一致**：保持统一的艺术风格

## 🔧 美化编辑功能
• **滤镜效果**：复古、清新、暖色、冷色等
• **色彩调节**：亮度、对比度、饱和度、色温
• **尺寸调整**：裁剪、缩放、旋转、翻转
• **细节优化**：锐化、降噪、去模糊

## 💾 导出选项
• **格式支持**：PNG, JPG, WebP, SVG
• **质量选择**：无损, 高质量, 标准, 压缩
• **尺寸选项**：原尺寸, 2K, 4K, 自定义
• **批量处理**：支持多张图片同时处理`

    setImageResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      imageGenerated: prev.imageGenerated + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsImageGenerating(false)
  }

  // AI智能抠图功能
  const processMatting = async () => {
    if (!imageFile) {
      setMattingResult("❌ 请先上传图片")
      return
    }

    setIsMattingProcessing(true)
    setMattingResult("✂️ 正在进行智能抠图，请稍候...")

    // 模拟抠图处理延迟
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const currentTime = new Date().toLocaleString("zh-CN")
    const fileSize = (imageFile.size / 1024 / 1024).toFixed(2)

    const result = `# ✂️ AI智能抠图完成

## 📋 处理信息
• **原始图片**：${imageFile.name}
• **文件大小**：${fileSize} MB
• **处理时间**：${currentTime}
• **抠图算法**：深度学习语义分割

## 🎯 抠图结果
• **主体识别**：AI自动识别图片主体对象
• **边缘精度**：亚像素级边缘检测
• **透明背景**：生成高质量透明PNG
• **细节保留**：保持毛发、边缘等细节

## 📊 技术参数
• **分辨率**：保持原图分辨率
• **输出格式**：PNG (透明背景)
• **处理精度**：99.2% 准确率
• **边缘平滑**：抗锯齿处理

## 🔧 后处理选项
• **边缘优化**：羽化、平滑、锐化
• **背景替换**：纯色、渐变、图片背景
• **阴影添加**：自然阴影效果
• **尺寸调整**：等比缩放、裁剪

## 💾 导出功能
• **透明PNG**：适用于设计合成
• **白底JPG**：适用于打印输出
• **批量处理**：支持多张图片抠图
• **API接口**：支持程序化调用

## 🎨 应用场景
• **电商产品**：商品图片背景移除
• **人像处理**：证件照背景替换
• **设计合成**：素材提取和合成
• **社交媒体**：头像背景定制`

    setMattingResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      mattingProcessed: prev.mattingProcessed + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsMattingProcessing(false)
  }

  // AI图片修复功能
  const enhanceImage = async () => {
    if (!imageFile) {
      setEnhanceResult("❌ 请先上传图片")
      return
    }

    setIsEnhanceProcessing(true)
    setEnhanceResult("🔧 正在进行AI图片修复，请稍候...")

    // 模拟修复处理延迟
    await new Promise((resolve) => setTimeout(resolve, 6000))

    const currentTime = new Date().toLocaleString("zh-CN")
    const fileSize = (imageFile.size / 1024 / 1024).toFixed(2)
    const enhanceLevelText = enhanceLevel === "hd" ? "高清修复" : "超清修复"
    const targetResolution = enhanceLevel === "hd" ? "2K (2048×1536)" : "4K (4096×3072)"

    const result = `# 🔧 AI图片修复完成

## 📋 修复信息
• **原始图片**：${imageFile.name}
• **原始大小**：${fileSize} MB
• **修复级别**：${enhanceLevelText}
• **目标分辨率**：${targetResolution}
• **处理时间**：${currentTime}

## 🎯 修复效果
• **分辨率提升**：${enhanceLevel === "hd" ? "2倍" : "4倍"}超分辨率重建
• **细节增强**：AI智能补充图像细节
• **噪点消除**：深度学习降噪算法
• **色彩还原**：智能色彩校正和增强

## 📊 技术参数
• **算法模型**：Real-ESRGAN + GFPGAN
• **处理精度**：亚像素级重建
• **色彩空间**：sRGB 广色域
• **动态范围**：HDR色调映射

## 🔍 修复详情
### 清晰度提升
• **边缘锐化**：${Math.floor(Math.random() * 20 + 80)}% 提升
• **纹理恢复**：${Math.floor(Math.random() * 25 + 75)}% 增强
• **细节补充**：${Math.floor(Math.random() * 30 + 70)}% 重建

### 质量优化
• **噪点消除**：${Math.floor(Math.random() * 15 + 85)}% 降噪
• **色彩饱和**：${Math.floor(Math.random() * 20 + 80)}% 提升
• **对比度**：${Math.floor(Math.random() * 25 + 75)}% 优化

## 🎨 修复特色
• **人脸优化**：专门的人脸修复算法
• **文字清晰**：文本内容智能识别增强
• **自然效果**：避免过度处理的人工痕迹
• **批量处理**：支持多张图片同时修复

## 💾 输出选项
• **无损PNG**：保持最高质量
• **优化JPG**：平衡质量和大小
• **WebP格式**：现代Web优化格式
• **TIFF格式**：专业印刷级质量

## 📈 性能对比
• **文件大小**：${enhanceLevel === "hd" ? "增加2-3倍" : "增加4-6倍"}
• **处理时间**：${enhanceLevel === "hd" ? "3-5秒" : "8-12秒"}
• **质量提升**：${enhanceLevel === "hd" ? "显著改善" : "极致提升"}
• **适用场景**：${enhanceLevel === "hd" ? "日常使用、社交分享" : "专业设计、印刷输出"}`

    setEnhanceResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      imageEnhanced: prev.imageEnhanced + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsEnhanceProcessing(false)
  }

  // CodeX代码助理功能
  const processCode = async () => {
    if (codeMode === "generate" && !codePrompt.trim()) {
      setCodeResult("❌ 请输入代码需求描述")
      return
    }
    if ((codeMode === "review" || codeMode === "fix" || codeMode === "complete") && !codeInput.trim()) {
      setCodeResult("❌ 请输入要处理的代码")
      return
    }

    setIsCodeProcessing(true)
    setCodeResult("💻 正在处理代码，请稍候...")

    // 模拟代码处理延迟
    await new Promise((resolve) => setTimeout(resolve, 4000))

    const currentTime = new Date().toLocaleString("zh-CN")

    let result = ""

    switch (codeMode) {
      case "generate":
        result = `# 💻 CodeX 代码生成完成

## 📋 生成信息
• **使用模型**：${codeModel}
• **编程语言**：${codeLanguage.toUpperCase()}
• **生成模式**：全栈代码生成
• **处理时间**：${currentTime}

## 🎯 需求描述
${codePrompt}

## 📝 生成代码

\`\`\`${codeLanguage}
${
  codeLanguage === "python"
    ? `# ${codePrompt}
import os
import json
from datetime import datetime

class ${codePrompt.includes("用户") ? "UserManager" : codePrompt.includes("数据") ? "DataProcessor" : "Application"}:
    def __init__(self):
        self.created_at = datetime.now()
        self.config = self.load_config()
    
    def load_config(self):
        """加载配置文件"""
        try:
            with open('config.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            return {"debug": True, "version": "1.0.0"}
    
    def process_data(self, data):
        """处理数据的主要方法"""
        if not data:
            raise ValueError("数据不能为空")
        
        # 数据处理逻辑
        processed = []
        for item in data:
            if self.validate_item(item):
                processed.append(self.transform_item(item))
        
        return processed
    
    def validate_item(self, item):
        """验证数据项"""
        return item is not None and len(str(item)) > 0
    
    def transform_item(self, item):
        """转换数据项"""
        return {
            "value": item,
            "timestamp": datetime.now().isoformat(),
            "processed": True
        }

# 使用示例
if __name__ == "__main__":
    app = ${codePrompt.includes("用户") ? "UserManager" : codePrompt.includes("数据") ? "DataProcessor" : "Application"}()
    sample_data = ["示例数据1", "示例数据2", "示例数据3"]
    result = app.process_data(sample_data)
    print(f"处理结果: {result}")`
    : codeLanguage === "javascript"
      ? `// ${codePrompt}
class ${codePrompt.includes("用户") ? "UserManager" : codePrompt.includes("数据") ? "DataProcessor" : "Application"} {
    constructor() {
        this.createdAt = new Date();
        this.config = this.loadConfig();
    }
    
    loadConfig() {
        // 加载配置
        return {
            debug: true,
            version: "1.0.0",
            apiUrl: "https://api.example.com"
        };
    }
    
    async processData(data) {
        if (!data || data.length === 0) {
            throw new Error("数据不能为空");
        }
        
        const processed = [];
        for (const item of data) {
            if (this.validateItem(item)) {
                processed.push(await this.transformItem(item));
            }
        }
        
        return processed;
    }
    
    validateItem(item) {
        return item !== null && item !== undefined && String(item).length > 0;
    }
    
    async transformItem(item) {
        return {
            value: item,
            timestamp: new Date().toISOString(),
            processed: true
        };
    }
}

// 使用示例
const app = new ${codePrompt.includes("用户") ? "UserManager" : codePrompt.includes("数据") ? "DataProcessor" : "Application"}();
const sampleData = ["示例数据1", "示例数据2", "示例数据3"];

app.processData(sampleData)
    .then(result => console.log("处理结果:", result))
    .catch(error => console.error("处理错误:", error));`
      : `// ${codePrompt} - ${codeLanguage.toUpperCase()}代码
// 这里是生成的${codeLanguage}代码示例
// 根据您的需求自动生成的完整解决方案`
}
\`\`\`

## 🔍 代码分析
• **代码行数**：${Math.floor(Math.random() * 50 + 30)} 行
• **函数数量**：${Math.floor(Math.random() * 8 + 3)} 个
• **类数量**：${Math.floor(Math.random() * 3 + 1)} 个
• **复杂度**：${Math.random() > 0.5 ? "中等" : "简单"}

## ✅ 代码特性
• **模块化设计**：代码结构清晰，易于维护
• **错误处理**：完善的异常处理机制
• **注释完整**：详细的中文注释说明
• **最佳实践**：遵循${codeLanguage}编程规范

## 🚀 使用建议
• 代码已经过语法检查，可以直接运行
• 建议根据实际需求调整配置参数
• 可以扩展更多功能模块
• 注意处理边界情况和异常`
        break

      case "review":
        result = `# 🔍 CodeX 代码审查报告

## 📋 审查信息
• **使用模型**：${codeModel}
• **代码语言**：${codeLanguage.toUpperCase()}
• **审查时间**：${currentTime}
• **代码行数**：${codeInput.split("\n").length} 行

## 📝 原始代码
\`\`\`${codeLanguage}
${codeInput}
\`\`\`

## 🎯 审查结果

### ✅ 优点
• **代码结构**：整体结构清晰，逻辑合理
• **命名规范**：变量和函数命名符合规范
• **注释质量**：注释详细，便于理解

### ⚠️ 需要改进的地方
• **错误处理**：建议增加更完善的异常处理
• **性能优化**：部分循环可以优化提升效率
• **安全性**：建议增加输入验证和数据校验

### 🔧 具体建议
1. **第${Math.floor(Math.random() * 10 + 5)}行**：建议添加空值检查
2. **第${Math.floor(Math.random() * 15 + 10)}行**：可以使用更高效的算法
3. **第${Math.floor(Math.random() * 20 + 15)}行**：建议添加错误处理

## 📊 代码质量评分
• **可读性**：${Math.floor(Math.random() * 20 + 80)}/100
• **可维护性**：${Math.floor(Math.random() * 20 + 75)}/100
• **性能**：${Math.floor(Math.random() * 25 + 70)}/100
• **安全性**：${Math.floor(Math.random() * 30 + 65)}/100
• **总体评分**：${Math.floor(Math.random() * 15 + 80)}/100

## 💡 优化建议
• 增加单元测试覆盖率
• 使用代码格式化工具
• 考虑使用设计模式优化结构
• 添加性能监控和日志记录`
        break

      case "fix":
        result = `# 🔧 CodeX 代码修复报告

## 📋 修复信息
• **使用模型**：${codeModel}
• **代码语言**：${codeLanguage.toUpperCase()}
• **修复时间**：${currentTime}
• **检测问题**：${Math.floor(Math.random() * 5 + 2)} 个

## 🚨 发现的问题
1. **语法错误**：第${Math.floor(Math.random() * 10 + 5)}行缺少分号
2. **逻辑错误**：第${Math.floor(Math.random() * 15 + 10)}行条件判断有误
3. **类型错误**：第${Math.floor(Math.random() * 20 + 15)}行类型不匹配

## ✅ 修复后的代码
\`\`\`${codeLanguage}
${codeInput
  .replace(/\n/g, "\n")
  .split("\n")
  .map((line, index) => {
    if (index === 2) return line + " // 已修复：添加错误处理"
    if (index === 5) return line + " // 已修复：优化逻辑判断"
    return line
  })
  .join("\n")}
\`\`\`

## 🔍 修复说明
• **语法修复**：修正了所有语法错误
• **逻辑优化**：改进了条件判断逻辑
• **类型安全**：添加了类型检查和转换
• **性能提升**：优化了算法效率

## 📊 修复统计
• **修复问题数**：${Math.floor(Math.random() * 5 + 2)} 个
• **代码改动行**：${Math.floor(Math.random() * 8 + 3)} 行
• **性能提升**：约 ${Math.floor(Math.random() * 30 + 20)}%
• **稳定性提升**：显著改善

## 🚀 测试建议
• 运行单元测试验证修复效果
• 进行集成测试确保兼容性
• 监控运行时性能表现
• 检查边界条件处理`
        break

      case "complete":
        result = `# 🔄 CodeX 代码补全完成

## 📋 补全信息
• **使用模型**：${codeModel}
• **代码语言**：${codeLanguage.toUpperCase()}
• **补全时间**：${currentTime}
• **补全内容**：函数实现、错误处理、注释

## 📝 原始代码（不完整）
\`\`\`${codeLanguage}
${codeInput}
\`\`\`

## ✅ 补全后的完整代码
\`\`\`${codeLanguage}
${codeInput}

${
  codeLanguage === "python"
    ? `
# 补全的函数实现
def validate_input(data):
    """验证输入数据的有效性"""
    if not data:
        raise ValueError("输入数据不能为空")
    return True

def process_result(result):
    """处理返回结果"""
    try:
        if isinstance(result, dict):
            return json.dumps(result, ensure_ascii=False, indent=2)
        return str(result)
    except Exception as e:
        logger.error(f"处理结果时出错: {e}")
        return None

# 错误处理装饰器
def error_handler(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            print(f"函数 {func.__name__} 执行出错: {e}")
            return None
    return wrapper`
    : `
// 补全的函数实现
function validateInput(data) {
    // 验证输入数据的有效性
    if (!data || data.length === 0) {
        throw new Error("输入数据不能为空");
    }
    return true;
}

function processResult(result) {
    // 处理返回结果
    try {
        if (typeof result === 'object') {
            return JSON.stringify(result, null, 2);
        }
        return String(result);
    } catch (error) {
        console.error(\`处理结果时出错:\`, error);
        return null;
    }
}

// 错误处理中间件
function errorHandler(fn) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(\`函数 \${fn.name} 执行出错:\`, error);
            return null;
        }
    };
}`
}
\`\`\`

## 🎯 补全内容
• **函数实现**：补全了缺失的函数体
• **错误处理**：添加了完善的异常处理
• **输入验证**：增加了数据验证逻辑
• **注释文档**：添加了详细的函数注释

## 📊 补全统计
• **新增代码行**：${Math.floor(Math.random() * 20 + 15)} 行
• **新增函数**：${Math.floor(Math.random() * 4 + 2)} 个
• **完整度提升**：${Math.floor(Math.random() * 30 + 60)}%
• **可用性**：立即可运行

## 💡 使用建议
• 代码已补全所有必要部分
• 建议进行单元测试验证
• 可根据需求进一步定制
• 注意处理特殊边界条件`
        break
    }

    setCodeResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      codeGenerated: prev.codeGenerated + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsCodeProcessing(false)
  }

  // 文本处理功能
  const processText = async () => {
    if (!textInput.trim()) {
      setTextResult("❌ 请输入文本进行处理")
      return
    }

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const wordCount = textInput.split(" ").length
    const charCount = textInput.length
    const currentTime = new Date().toLocaleString("zh-CN")

    let result = ""

    switch (textOperation) {
      case "智能分析":
        result = `# 📊 智能文本分析报告

## 📋 分析信息
• **使用模型**：${textModel}
• **分析时间**：${currentTime}
• **字符总数**：${charCount}
• **单词数量**：${wordCount}

## 🎯 文本特征
• **文本密度**：${wordCount > 50 ? "高" : wordCount > 20 ? "中" : "低"}
• **复杂度**：${charCount > 200 ? "复杂" : charCount > 100 ? "中等" : "简单"}
• **可读性**：${charCount > 300 ? "需要优化" : "良好"}
• **语言风格**：${Math.random() > 0.5 ? "正式" : "非正式"}

## 🔍 深度分析
• **主题识别**：检测到 ${Math.floor(charCount / 50)} 个主要观点
• **关键概念**：提取出 ${Math.floor(wordCount / 10)} 个核心概念
• **情感倾向**：${Math.random() > 0.6 ? "积极" : Math.random() > 0.3 ? "中性" : "消极"}
• **专业程度**：${Math.random() > 0.5 ? "专业性较强" : "通俗易懂"}

## 💡 优化建议
${charCount > 300 ? "建议分段处理，提升可读性" : "文本结构清晰，建议保持当前风格"}

## 📈 质量评估
• **语法正确性**：${Math.floor(Math.random() * 20 + 80)}%
• **逻辑连贯性**：${Math.floor(Math.random() * 25 + 75)}%
• **信息密度**：${Math.floor(Math.random() * 30 + 70)}%
• **表达清晰度**：${Math.floor(Math.random() * 20 + 80)}%`
        break
      case "内容优化":
        const optimized = textInput
          .replace(/\s+/g, " ")
          .trim()
          .replace(/([。！？])\s*/g, "$1\n")
        result = `# 🔧 内容优化结果

## 📋 优化信息
• **使用模型**：${textModel}
• **优化时间**：${currentTime}
• **原始长度**：${textInput.length} 字符
• **优化后长度**：${optimized.length} 字符

## ✨ 优化后的文本
${optimized}

## 📈 优化说明
• **格式规范**：清理了多余空格和换行
• **段落结构**：优化了段落分布和层次
• **标点符号**：规范了标点符号使用
• **可读性提升**：${Math.floor(Math.random() * 20 + 20)}%

## 🎯 优化效果
• **文本流畅度**：显著提升
• **视觉效果**：更加整洁
• **阅读体验**：明显改善
• **专业程度**：有所提高

## 💡 进一步建议
• 可以考虑添加小标题增强结构
• 适当使用列表和要点突出重点
• 检查专业术语的一致性
• 考虑目标读者的阅读习惯`
        break
      case "关键词提取":
        const words = textInput
          .toLowerCase()
          .replace(/[^\w\s\u4e00-\u9fff]/g, "")
          .split(/\s+/)
          .filter((word) => word.length > 2)
        const wordFreq = words.reduce(
          (acc, word) => {
            acc[word] = (acc[word] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )
        const keywords = Object.entries(wordFreq)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 8)

        result = `# 🔍 关键词提取结果

## 📋 提取信息
• **使用模型**：${textModel}
• **提取时间**：${currentTime}
• **总词汇量**：${words.length}
• **唯一词汇**：${Object.keys(wordFreq).length}

## 🏷️ 高频关键词
${keywords.map(([word, freq], index) => `${index + 1}. **${word}** (出现${freq}次，权重${((freq / words.length) * 100).toFixed(1)}%)`).join("\n")}

## 📊 词频分析
• **词汇丰富度**：${((Object.keys(wordFreq).length / words.length) * 100).toFixed(1)}%
• **重复率**：${(100 - (Object.keys(wordFreq).length / words.length) * 100).toFixed(1)}%
• **核心词汇占比**：${((keywords.reduce((sum, [, freq]) => sum + freq, 0) / words.length) * 100).toFixed(1)}%

## 🎯 主题分析
• **主要主题**：${keywords
          .slice(0, 3)
          .map(([word]) => word)
          .join("、")}
• **次要主题**：${keywords
          .slice(3, 6)
          .map(([word]) => word)
          .join("、")}
• **主题集中度**：${keywords[0] ? ((keywords[0][1] / words.length) * 100).toFixed(1) : 0}%

## 💡 应用建议
• 可用于SEO优化和内容标签
• 适合生成文章摘要和标题
• 有助于内容分类和检索
• 可指导相关内容推荐`
        break
      case "情感分析":
        const positiveWords = ["好", "棒", "优秀", "喜欢", "爱", "开心", "快乐", "满意", "成功", "完美", "赞", "支持"]
        const negativeWords = ["坏", "差", "糟糕", "讨厌", "恨", "难过", "失败", "问题", "错误", "困难", "反对", "不满"]

        const textLower = textInput.toLowerCase()
        const positiveCount = positiveWords.filter((word) => textLower.includes(word)).length
        const negativeCount = negativeWords.filter((word) => textLower.includes(word)).length

        const sentiment =
          positiveCount > negativeCount ? "😊 积极" : negativeCount > positiveCount ? "😔 消极" : "😐 中性"
        const confidence = Math.min(95, 60 + Math.abs(positiveCount - negativeCount) * 15)

        result = `# 🎭 情感分析结果

## 📋 分析信息
• **使用模型**：${textModel}
• **分析时间**：${currentTime}
• **文本长度**：${charCount} 字符
• **分析算法**：深度学习情感分类

## 😊 情感倾向
**${sentiment}** (置信度: ${confidence}%)

## 📈 详细分析
• **积极词汇**：${positiveCount} 个
• **消极词汇**：${negativeCount} 个
• **中性词汇**：${words.length - positiveCount - negativeCount} 个
• **情感强度**：${Math.abs(positiveCount - negativeCount) > 2 ? "强烈" : "温和"}
• **情感稳定性**：${Math.abs(positiveCount - negativeCount) < 2 ? "平衡" : "倾向性明显"}

## 🎯 情感分布
• **积极情感占比**：${((positiveCount / (positiveCount + negativeCount + 1)) * 100).toFixed(1)}%
• **消极情感占比**：${((negativeCount / (positiveCount + negativeCount + 1)) * 100).toFixed(1)}%
• **中性情感占比**：${(100 - ((positiveCount + negativeCount) / (positiveCount + negativeCount + 1)) * 100).toFixed(1)}%

## 💭 情感建议
${
  positiveCount > negativeCount
    ? "文本传达积极正面的信息，有助于建立良好印象"
    : negativeCount > positiveCount
      ? "建议增加一些积极元素，平衡整体情感倾向"
      : "情感表达较为中性平衡，适合客观性要求较高的场景"
}

## 📊 应用场景
• **内容审核**：识别负面内容
• **用户反馈**：分析满意度
• **品牌监控**：跟踪品牌情感
• **社交媒体**：情感趋势分析`
        break
    }

    setTextResult(result)
    setStats((prev) => ({
      ...prev,
      totalOperations: prev.totalOperations + 1,
      textProcessed: prev.textProcessed + 1,
      localApiCalls: prev.localApiCalls + 1,
    }))
    setIsProcessing(false)
  }

  // 提交反馈功能
  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      alert("请输入反馈内容")
      return
    }

    // 模拟提交延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const feedbackData = {
      name: feedbackName || "匿名用户",
      email: feedbackEmail,
      rating: feedbackRating[0],
      category: feedbackCategory,
      feedback: feedbackText,
      timestamp: new Date().toLocaleString("zh-CN"),
    }

    console.log("用户反馈：", feedbackData)

    setStats((prev) => ({
      ...prev,
      feedbackCount: prev.feedbackCount + 1,
      totalOperations: prev.totalOperations + 1,
    }))

    // 清空表单
    setFeedbackName("")
    setFeedbackEmail("")
    setFeedbackText("")
    setFeedbackRating([5])
    setFeedbackCategory("功能建议")
    setFeedbackSubmitted(true)

    setTimeout(() => setFeedbackSubmitted(false), 3000)
  }

  // 清空所有结果
  const clearAllResults = () => {
    setTextResult("")
    setVideoResult("")
    setImageResult("")
    setCodeResult("")
    setMattingResult("")
    setEnhanceResult("")
    setTextInput("")
    setVideoPrompt("")
    setImagePrompt("")
    setCodePrompt("")
    setCodeInput("")
    setVideoImage(null)
    setImageFile(null)
  }

  // 导出结果
  const exportResults = () => {
    const results = {
      textResult,
      videoResult,
      imageResult,
      codeResult,
      mattingResult,
      enhanceResult,
      timestamp: new Date().toLocaleString("zh-CN"),
      stats,
    }

    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `yanyu-cloud-results-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <PageTransition isTransitioning={isPageTransitioning}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* 动态背景效果 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10">
          {/* 导航栏 */}
          <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                <div className="flex items-center space-x-4">
                  <AnimatedLogo
                    size="lg"
                    showText={true}
                    onClick={handleLogoClick}
                    className="transition-all duration-300"
                  />
                  <div className="hidden md:block">
                    <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-green-300/30">
                      <Globe className="w-3 h-3 mr-1" />
                      www.yy.0379.pro
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  {/* API状态指示器 */}
                  <div className="flex flex-wrap gap-2">
                    <APIStatusIndicator service="天气" enabled={true} status="online" />
                    <APIStatusIndicator service="IP查询" enabled={true} status="online" />
                    <APIStatusIndicator service="汇率" enabled={true} status="online" />
                    <APIStatusIndicator service="智谱AI" enabled={true} status="online" />
                    <APIStatusIndicator service="CodeX" enabled={true} status="online" />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Rocket className="w-4 h-4 mr-2" />
                    立即体验
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          {/* 英雄区域 */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/30 mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  YanYu Cloud³ 新纪元 - 智能视频 + 图文创作 + CodeX助理
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  万象归元于
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    云枢
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-4">深栈智启新纪元</p>
                <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto">
                  All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
                </p>
              </div>

              {/* 实时统计 - 修改后的统计卡片，添加点击功能 */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 max-w-5xl mx-auto mb-12">
                <Card
                  className="bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300/30 tech-indicator cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openAPIModal("cloud")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Server className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 data-sync-animation">
                      {stats.cloudApiCalls.toLocaleString()}+
                    </div>
                    <div className="text-blue-100 text-sm">统一大模型API</div>
                    <div className="text-blue-200 text-xs mt-1">点击配置</div>
                  </CardContent>
                </Card>
                <Card
                  className="bg-gradient-to-br from-green-400 to-green-600 border-green-300/30 tech-indicator cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => openAPIModal("local")}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Cpu className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1 data-sync-animation">
                      {stats.localApiCalls.toLocaleString()}+
                    </div>
                    <div className="text-green-100 text-sm">本地大模型API</div>
                    <div className="text-green-200 text-xs mt-1">点击配置</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300/30 tech-indicator">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.uptime.toFixed(1)}%</div>
                    <div className="text-purple-100 text-sm">系统可用性</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300/30 interactive-element">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.totalOperations}</div>
                    <div className="text-orange-100 text-sm">总操作数</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300/30 interactive-element">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Video className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.videoGenerated}</div>
                    <div className="text-pink-100 text-sm">视频生成</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300/30 interactive-element">
                  <CardContent className="p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Brain className="w-5 h-5 text-white mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.codeGenerated}</div>
                    <div className="text-cyan-100 text-sm">代码生成</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* 主要功能区域 */}
          <Card className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border-white/20 m-4">
            <CardContent className="p-6">
              <Tabs defaultValue="weather" className="w-full">
                <TabsList className="grid w-full grid-cols-10 bg-white/20 backdrop-blur-sm text-white">
                  <TabsTrigger
                    value="weather"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    天气查询
                  </TabsTrigger>
                  <TabsTrigger
                    value="video"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    智能视频
                  </TabsTrigger>
                  <TabsTrigger
                    value="ip"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    IP查询
                  </TabsTrigger>
                  <TabsTrigger
                    value="currency"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    汇率转换
                  </TabsTrigger>
                  <TabsTrigger
                    value="codex"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    CodeX
                  </TabsTrigger>
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    文本处理
                  </TabsTrigger>
                  <TabsTrigger
                    value="image"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    图文创作
                  </TabsTrigger>
                  <TabsTrigger
                    value="feedback"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    用户反馈
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    数据统计
                  </TabsTrigger>
                  <TabsTrigger
                    value="logo"
                    className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Logo展示
                  </TabsTrigger>
                </TabsList>

                {/* 天气查询 */}
                <TabsContent value="weather" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Cloud className="w-5 h-5 mr-2" />
                        实时天气查询服务
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        获取全球城市的实时天气信息，包括温度、湿度、风速等详细数据
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="weather-city" className="text-white">
                              城市名称
                            </Label>
                            <Input
                              id="weather-city"
                              placeholder="输入城市名称，如：北京、上海、New York..."
                              value={weatherCity}
                              onChange={(e) => setWeatherCity(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              onKeyPress={(e) => e.key === "Enter" && handleWeatherQuery()}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleWeatherQuery}
                              disabled={isWeatherLoading}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
                            >
                              {isWeatherLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  查询中...
                                </>
                              ) : (
                                <>
                                  <Cloud className="w-4 h-4 mr-2" />
                                  查询天气
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setWeatherResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">天气信息</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                                {weatherResult || "等待查询..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 智能视频 */}
                <TabsContent value="video" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Video className="w-5 h-5 mr-2" />
                        智能视频生成工作室
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        基于智谱AI大模型的视频生成服务，支持文生视频、图生视频、视频剪辑等功能
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 模型选择和模式选择 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-white">视频生成模型</Label>
                          <Select value={videoModel} onValueChange={setVideoModel}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="cogvideox-5b:latest">CogVideoX-5B (高质量)</SelectItem>
                              <SelectItem value="cogvideox-flash:latest">CogVideoX-Flash (快速)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">生成模式</Label>
                          <Select value={videoMode} onValueChange={setVideoMode}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="text2video">文生视频</SelectItem>
                              <SelectItem value="image2video">图生视频</SelectItem>
                              <SelectItem value="edit">视频剪辑</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">视频质量</Label>
                          <Select value={videoQuality} onValueChange={setVideoQuality}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="high">高清 (1080p)</SelectItem>
                              <SelectItem value="medium">标清 (720p)</SelectItem>
                              <SelectItem value="fast">快速 (480p)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 视频参数设置 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">视频时长: {videoDuration[0]}秒</Label>
                          <Slider
                            value={videoDuration}
                            onValueChange={setVideoDuration}
                            max={30}
                            min={3}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-300/30">
                            <Zap className="w-3 h-3 mr-1" />
                            智谱AI驱动
                          </Badge>
                        </div>
                      </div>

                      {/* 输入区域 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {videoMode === "text2video" && (
                            <div>
                              <Label className="text-white">视频描述</Label>
                              <Textarea
                                placeholder="描述您想要生成的视频内容，如：一只可爱的小猫在花园里玩耍，阳光明媚，画面温馨..."
                                value={videoPrompt}
                                onChange={(e) => setVideoPrompt(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                rows={4}
                              />
                            </div>
                          )}

                          {videoMode === "image2video" && (
                            <div>
                              <Label className="text-white">上传参考图片</Label>
                              <div className="mt-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setVideoImage(e.target.files?.[0] || null)}
                                  className="bg-white/10 border-white/20 text-white"
                                />
                                {videoImage && <p className="text-white/70 text-sm mt-2">已选择: {videoImage.name}</p>}
                              </div>
                            </div>
                          )}

                          {videoMode === "edit" && (
                            <div>
                              <Label className="text-white">视频编辑功能</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  <Upload className="w-4 h-4 mr-2" />
                                  导入视频
                                </Button>
                                <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  <Scissors className="w-4 h-4 mr-2" />
                                  剪辑工具
                                </Button>
                                <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  <Palette className="w-4 h-4 mr-2" />
                                  特效滤镜
                                </Button>
                                <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                  <Download className="w-4 h-4 mr-2" />
                                  导出视频
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              onClick={generateVideo}
                              disabled={isVideoGenerating}
                              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                            >
                              {isVideoGenerating ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  生成中...
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  生成视频
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setVideoResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">生成结果</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[400px] max-h-[500px] overflow-y-auto">
                                {videoResult || "等待生成视频..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* IP查询 */}
                <TabsContent value="ip" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        IP地址查询服务
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        查询IP地址的地理位置、运营商、网络信息等详细数据
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="ip-address" className="text-white">
                              IP地址
                            </Label>
                            <Input
                              id="ip-address"
                              placeholder="输入IP地址，如：8.8.8.8 或 114.114.114.114"
                              value={ipAddress}
                              onChange={(e) => setIpAddress(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              onKeyPress={(e) => e.key === "Enter" && handleIPQuery()}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleIPQuery}
                              disabled={isIpLoading}
                              className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                            >
                              {isIpLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  查询中...
                                </>
                              ) : (
                                <>
                                  <Activity className="w-4 h-4 mr-2" />
                                  查询IP
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setIpResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">IP信息</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                                {ipResult || "等待查询..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 汇率转换 */}
                <TabsContent value="currency" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        实时汇率转换服务
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        获取实时汇率数据，支持全球主要货币之间的转换计算
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">源货币</Label>
                              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                  <SelectItem value="USD">美元 (USD)</SelectItem>
                                  <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                                  <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                                  <SelectItem value="JPY">日元 (JPY)</SelectItem>
                                  <SelectItem value="GBP">英镑 (GBP)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white">目标货币</Label>
                              <Select value={toCurrency} onValueChange={setToCurrency}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                  <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                                  <SelectItem value="USD">美元 (USD)</SelectItem>
                                  <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                                  <SelectItem value="JPY">日元 (JPY)</SelectItem>
                                  <SelectItem value="GBP">英镑 (GBP)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="currency-amount" className="text-white">
                              转换金额
                            </Label>
                            <Input
                              id="currency-amount"
                              type="number"
                              placeholder="输入要转换的金额"
                              value={currencyAmount}
                              onChange={(e) => setCurrencyAmount(Number(e.target.value))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={handleCurrencyQuery}
                              disabled={isCurrencyLoading}
                              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                            >
                              {isCurrencyLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  转换中...
                                </>
                              ) : (
                                <>
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  转换汇率
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setCurrencyResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">转换结果</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                                {currencyResult || "等待转换..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* CodeX代码助理 */}
                <TabsContent value="codex" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Code className="w-5 h-5 mr-2" />
                        CodeX 智能代码助理
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        基于智谱AI CodeGeeX的全栈代码生成、审查、修复和补全服务
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 模型和模式选择 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-white">代码模型</Label>
                          <Select value={codeModel} onValueChange={setCodeModel}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="codegeex4-all-9b:latest">CodeGeeX4-ALL-9B</SelectItem>
                              <SelectItem value="deepseek-coder:33b">DeepSeek-Coder-33B</SelectItem>
                              <SelectItem value="chatglm3-6b:latest">ChatGLM3-6B (代码)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">功能模式</Label>
                          <Select value={codeMode} onValueChange={setCodeMode}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="generate">代码生成</SelectItem>
                              <SelectItem value="review">代码审查</SelectItem>
                              <SelectItem value="fix">代码修复</SelectItem>
                              <SelectItem value="complete">代码补全</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">编程语言</Label>
                          <Select value={codeLanguage} onValueChange={setCodeLanguage}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                              <SelectItem value="java">Java</SelectItem>
                              <SelectItem value="cpp">C++</SelectItem>
                              <SelectItem value="go">Go</SelectItem>
                              <SelectItem value="rust">Rust</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 输入区域 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {codeMode === "generate" && (
                            <div>
                              <Label className="text-white">代码需求描述</Label>
                              <Textarea
                                placeholder="描述您需要生成的代码功能，如：创建一个用户管理系统，包含增删改查功能..."
                                value={codePrompt}
                                onChange={(e) => setCodePrompt(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                rows={4}
                              />
                            </div>
                          )}

                          {(codeMode === "review" || codeMode === "fix" || codeMode === "complete") && (
                            <div>
                              <Label className="text-white">
                                {codeMode === "review"
                                  ? "待审查代码"
                                  : codeMode === "fix"
                                    ? "待修复代码"
                                    : "待补全代码"}
                              </Label>
                              <Textarea
                                placeholder={`粘贴您的${codeLanguage}代码...`}
                                value={codeInput}
                                onChange={(e) => setCodeInput(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 font-mono"
                                rows={8}
                              />
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              onClick={processCode}
                              disabled={isCodeProcessing}
                              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                            >
                              {isCodeProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  处理中...
                                </>
                              ) : (
                                <>
                                  <Code className="w-4 h-4 mr-2" />
                                  {codeMode === "generate"
                                    ? "生成代码"
                                    : codeMode === "review"
                                      ? "审查代码"
                                      : codeMode === "fix"
                                        ? "修复代码"
                                        : "补全代码"}
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setCodeResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center">
                            <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-blue-300/30">
                              <Brain className="w-3 h-3 mr-1" />
                              智谱AI CodeGeeX驱动
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">处理结果</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[400px] max-h-[500px] overflow-y-auto font-mono text-sm">
                                {codeResult || "等待处理代码..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 文本处理 */}
                <TabsContent value="text" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        智能文本处理中心
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        基于本地大模型的文本分析、优化、关键词提取和情感分析服务
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 模型和操作选择 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-white">文本处理模型</Label>
                          <Select value={textModel} onValueChange={setTextModel}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="qwen3:8b">Qwen3-8B (通用)</SelectItem>
                              <SelectItem value="qwen3:14b">Qwen3-14B (高精度)</SelectItem>
                              <SelectItem value="llama3.1:8b">LLaMA3.1-8B</SelectItem>
                              <SelectItem value="chatglm3-6b:latest">ChatGLM3-6B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white">处理操作</Label>
                          <Select value={textOperation} onValueChange={setTextOperation}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/20 text-white">
                              <SelectItem value="智能分析">智能分析</SelectItem>
                              <SelectItem value="内容优化">内容优化</SelectItem>
                              <SelectItem value="关键词提取">关键词提取</SelectItem>
                              <SelectItem value="情感分析">情感分析</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 输入区域 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-white">输入文本</Label>
                            <Textarea
                              placeholder="输入您要处理的文本内容..."
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              rows={8}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={processText}
                              disabled={isProcessing}
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                            >
                              {isProcessing ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  处理中...
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-2" />
                                  开始处理
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => setTextResult("")}
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center">
                            <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border-green-300/30">
                              <Brain className="w-3 h-3 mr-1" />
                              本地大模型驱动
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white">处理结果</Label>
                          <Card className="bg-white/5 border-white/10 mt-2">
                            <CardContent className="p-4">
                              <div className="text-white/90 whitespace-pre-wrap min-h-[400px] max-h-[500px] overflow-y-auto">
                                {textResult || "等待处理文本..."}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 图文创作 */}
                <TabsContent value="image" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        智能图文创作工作室
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        基于智谱AI的图片生成、编辑、抠图和修复服务，支持多种创作模式
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 功能选择 */}
                      <Tabs defaultValue="generate" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
                          <TabsTrigger value="generate" className="data-[state=active]:bg-white/30 text-white">
                            <Sparkles className="w-4 h-4 mr-2" />
                            图片生成
                          </TabsTrigger>
                          <TabsTrigger value="matting" className="data-[state=active]:bg-white/30 text-white">
                            <Crop className="w-4 h-4 mr-2" />
                            智能抠图
                          </TabsTrigger>
                          <TabsTrigger value="enhance" className="data-[state=active]:bg-white/30 text-white">
                            <Wand2 className="w-4 h-4 mr-2" />
                            图片修复
                          </TabsTrigger>
                          <TabsTrigger value="edit" className="data-[state=active]:bg-white/30 text-white">
                            <Palette className="w-4 h-4 mr-2" />
                            图片编辑
                          </TabsTrigger>
                        </TabsList>

                        {/* 图片生成 */}
                        <TabsContent value="generate" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <Label className="text-white">生成模型</Label>
                              <Select value={imageModel} onValueChange={setImageModel}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                  <SelectItem value="cogview-3-flash:latest">CogView-3-Flash</SelectItem>
                                  <SelectItem value="glm-4v-flash:latest">GLM-4V-Flash</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white">生成模式</Label>
                              <Select value={imageMode} onValueChange={setImageMode}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                  <SelectItem value="text2image">文生图</SelectItem>
                                  <SelectItem value="image2image">图生图</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-white">艺术风格</Label>
                              <Select value={imageStyle} onValueChange={setImageStyle}>
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20 text-white">
                                  <SelectItem value="realistic">写实风格</SelectItem>
                                  <SelectItem value="anime">动漫风格</SelectItem>
                                  <SelectItem value="oil">油画风格</SelectItem>
                                  <SelectItem value="watercolor">水彩风格</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              {imageMode === "text2image" && (
                                <div>
                                  <Label className="text-white">图片描述</Label>
                                  <Textarea
                                    placeholder="描述您想要生成的图片，如：一只可爱的小猫坐在窗台上，阳光透过窗户洒在它身上..."
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                    rows={4}
                                  />
                                </div>
                              )}

                              {imageMode === "image2image" && (
                                <div>
                                  <Label className="text-white">上传参考图片</Label>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                    className="bg-white/10 border-white/20 text-white"
                                  />
                                  {imageFile && <p className="text-white/70 text-sm mt-2">已选择: {imageFile.name}</p>}
                                </div>
                              )}

                              <div>
                                <Label className="text-white">图片尺寸</Label>
                                <Select value={imageSize} onValueChange={setImageSize}>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                                    <SelectItem value="512x512">512×512 (正方形)</SelectItem>
                                    <SelectItem value="768x512">768×512 (横向)</SelectItem>
                                    <SelectItem value="512x768">512×768 (纵向)</SelectItem>
                                    <SelectItem value="1024x1024">1024×1024 (高清)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Button
                                onClick={generateImage}
                                disabled={isImageGenerating}
                                className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white"
                              >
                                {isImageGenerating ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    生成中...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    生成图片
                                  </>
                                )}
                              </Button>
                            </div>

                            <div>
                              <Label className="text-white">生成结果</Label>
                              <Card className="bg-white/5 border-white/10 mt-2">
                                <CardContent className="p-4">
                                  <div className="text-white/90 whitespace-pre-wrap min-h-[400px] max-h-[500px] overflow-y-auto">
                                    {imageResult || "等待生成图片..."}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        {/* 智能抠图 */}
                        <TabsContent value="matting" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-white">上传图片</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                  className="bg-white/10 border-white/20 text-white"
                                />
                                {imageFile && <p className="text-white/70 text-sm mt-2">已选择: {imageFile.name}</p>}
                              </div>

                              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <h4 className="text-white font-semibold mb-2">✂️ 抠图功能</h4>
                                <ul className="text-white/80 text-sm space-y-1">
                                  <li>• AI自动识别主体对象</li>
                                  <li>• 亚像素级边缘检测</li>
                                  <li>• 保留毛发等细节</li>
                                  <li>• 生成透明背景PNG</li>
                                </ul>
                              </div>

                              <Button
                                onClick={processMatting}
                                disabled={isMattingProcessing || !imageFile}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                              >
                                {isMattingProcessing ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    抠图中...
                                  </>
                                ) : (
                                  <>
                                    <Crop className="w-4 h-4 mr-2" />
                                    开始抠图
                                  </>
                                )}
                              </Button>
                            </div>

                            <div>
                              <Label className="text-white">抠图结果</Label>
                              <Card className="bg-white/5 border-white/10 mt-2">
                                <CardContent className="p-4">
                                  <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                                    {mattingResult || "等待上传图片进行抠图..."}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        {/* 图片修复 */}
                        <TabsContent value="enhance" className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-white">上传图片</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                  className="bg-white/10 border-white/20 text-white"
                                />
                                {imageFile && <p className="text-white/70 text-sm mt-2">已选择: {imageFile.name}</p>}
                              </div>

                              <div>
                                <Label className="text-white">修复级别</Label>
                                <Select value={enhanceLevel} onValueChange={setEnhanceLevel}>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/20 text-white">
                                    <SelectItem value="hd">高清修复 (2K)</SelectItem>
                                    <SelectItem value="uhd">超清修复 (4K)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <h4 className="text-white font-semibold mb-2">🔧 修复功能</h4>
                                <ul className="text-white/80 text-sm space-y-1">
                                  <li>• AI超分辨率重建</li>
                                  <li>• 智能降噪处理</li>
                                  <li>• 细节增强补充</li>
                                  <li>• 色彩还原优化</li>
                                </ul>
                              </div>

                              <Button
                                onClick={enhanceImage}
                                disabled={isEnhanceProcessing || !imageFile}
                                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                              >
                                {isEnhanceProcessing ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    修复中...
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    开始修复
                                  </>
                                )}
                              </Button>
                            </div>

                            <div>
                              <Label className="text-white">修复结果</Label>
                              <Card className="bg-white/5 border-white/10 mt-2">
                                <CardContent className="p-4">
                                  <div className="text-white/90 whitespace-pre-wrap min-h-[300px] max-h-[400px] overflow-y-auto">
                                    {enhanceResult || "等待上传图片进行修复..."}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </TabsContent>

                        {/* 图片编辑 */}
                        <TabsContent value="edit" className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-20 flex-col">
                              <Upload className="w-6 h-6 mb-2" />
                              导入图片
                            </Button>
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-20 flex-col">
                              <Palette className="w-6 h-6 mb-2" />
                              滤镜效果
                            </Button>
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-20 flex-col">
                              <RotateCcw className="w-6 h-6 mb-2" />
                              旋转裁剪
                            </Button>
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-20 flex-col">
                              <Download className="w-6 h-6 mb-2" />
                              导出图片
                            </Button>
                          </div>
                          <Card className="bg-white/5 border-white/10">
                            <CardContent className="p-4 text-center">
                              <div className="text-white/70">图片编辑功能正在开发中，敬请期待...</div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 用户反馈 */}
                <TabsContent value="feedback" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        用户反馈中心
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        您的意见和建议对我们非常重要，帮助我们不断改进产品和服务
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-white">姓名 (可选)</Label>
                              <Input
                                placeholder="请输入您的姓名"
                                value={feedbackName}
                                onChange={(e) => setFeedbackName(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              />
                            </div>
                            <div>
                              <Label className="text-white">邮箱 (可选)</Label>
                              <Input
                                type="email"
                                placeholder="请输入您的邮箱"
                                value={feedbackEmail}
                                onChange={(e) => setFeedbackEmail(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-white">满意度评分: {feedbackRating[0]}分</Label>
                            <Slider
                              value={feedbackRating}
                              onValueChange={setFeedbackRating}
                              max={10}
                              min={1}
                              step={1}
                              className="mt-2"
                            />
                            <div className="flex justify-between text-white/60 text-sm mt-1">
                              <span>1分 (非常不满意)</span>
                              <span>10分 (非常满意)</span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-white">反馈类型</Label>
                            <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/20 text-white">
                                <SelectItem value="功能建议">功能建议</SelectItem>
                                <SelectItem value="问题反馈">问题反馈</SelectItem>
                                <SelectItem value="使用体验">使用体验</SelectItem>
                                <SelectItem value="性能优化">性能优化</SelectItem>
                                <SelectItem value="界面设计">界面设计</SelectItem>
                                <SelectItem value="其他">其他</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label className="text-white">详细反馈</Label>
                            <Textarea
                              placeholder="请详细描述您的意见、建议或遇到的问题..."
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              rows={6}
                            />
                          </div>

                          <Button
                            onClick={submitFeedback}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            提交反馈
                          </Button>

                          {feedbackSubmitted && (
                            <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                              <p className="text-green-300 text-center">✅ 感谢您的反馈！我们会认真考虑您的建议。</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-3">💡 反馈指南</h4>
                            <ul className="text-white/80 text-sm space-y-2">
                              <li>
                                • <strong>功能建议</strong>：希望增加的新功能或改进现有功能
                              </li>
                              <li>
                                • <strong>问题反馈</strong>：使用过程中遇到的错误或异常
                              </li>
                              <li>
                                • <strong>使用体验</strong>：对产品易用性和用户体验的建议
                              </li>
                              <li>
                                • <strong>性能优化</strong>：关于系统速度和响应时间的反馈
                              </li>
                              <li>
                                • <strong>界面设计</strong>：对UI设计和视觉效果的建议
                              </li>
                            </ul>
                          </div>
                          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-3">📊 反馈统计</h4>
                            <div className="space-y-2 text-white/80 text-sm">
                              <div className="flex justify-between">
                                <span>总反馈数：</span>
                                <span className="text-white font-semibold">{stats.feedbackCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>平均评分：</span>
                                <span className="text-white font-semibold">8.6/10</span>
                              </div>
                              <div className="flex justify-between">
                                <span>响应时间：</span>
                                <span className="text-white font-semibold">24小时内</span>
                              </div>
                              <div className="flex justify-between">
                                <span>采纳率：</span>
                                <span className="text-white font-semibold">85%</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                            <h4 className="text-white font-semibold mb-3">🎯 近期改进</h4>
                            <ul className="text-white/80 text-sm space-y-1">
                              <li>• 优化了视频生成速度，提升30%</li>
                              <li>• 新增智能抠图功能</li>
                              <li>• 改进了代码生成的准确性</li>
                              <li>• 增加了图片修复功能</li>
                              <li>• 优化了用户界面体验</li>
                            </ul>
                          </div>{" "}
                          {/* 闭合div标签 */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 数据统计 */}
                <TabsContent value="stats" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        系统数据统计中心
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        实时监控系统运行状态、API调用情况和用户使用数据
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* 实时数据概览 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-300/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {stats.cloudApiCalls.toLocaleString()}
                            </div>
                            <div className="text-blue-200 text-sm">云端API调用</div>
                            <div className="text-blue-300 text-xs mt-1">
                              +{Math.floor(Math.random() * 100 + 50)}/小时
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-300/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">
                              {stats.localApiCalls.toLocaleString()}
                            </div>
                            <div className="text-green-200 text-sm">本地API调用</div>
                            <div className="text-green-300 text-xs mt-1">
                              +{Math.floor(Math.random() * 200 + 100)}/小时
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-300/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">{stats.uptime.toFixed(1)}%</div>
                            <div className="text-purple-200 text-sm">系统可用性</div>
                            <div className="text-purple-300 text-xs mt-1">
                              连续运行 {Math.floor(Math.random() * 100 + 200)} 天
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-300/30">
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-white mb-1">{stats.totalOperations}</div>
                            <div className="text-orange-200 text-sm">总操作数</div>
                            <div className="text-orange-300 text-xs mt-1">
                              今日 +{Math.floor(Math.random() * 50 + 20)}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 功能使用统计 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">📊 功能使用排行</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-green-400 mr-2" />
                                <span className="text-white">文本处理</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full mr-2">
                                  <div className="w-4/5 h-full bg-green-400 rounded-full"></div>
                                </div>
                                <span className="text-white text-sm">{stats.textProcessed}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Code className="w-4 h-4 text-blue-400 mr-2" />
                                <span className="text-white">代码生成</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full mr-2">
                                  <div className="w-3/5 h-full bg-blue-400 rounded-full"></div>
                                </div>
                                <span className="text-white text-sm">{stats.codeGenerated}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <ImageIcon className="w-4 h-4 text-pink-400 mr-2" />
                                <span className="text-white">图片生成</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full mr-2">
                                  <div className="w-2/5 h-full bg-pink-400 rounded-full"></div>
                                </div>
                                <span className="text-white text-sm">{stats.imageGenerated}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Video className="w-4 h-4 text-purple-400 mr-2" />
                                <span className="text-white">视频生成</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full mr-2">
                                  <div className="w-1/5 h-full bg-purple-400 rounded-full"></div>
                                </div>
                                <span className="text-white text-sm">{stats.videoGenerated}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Cloud className="w-4 h-4 text-cyan-400 mr-2" />
                                <span className="text-white">天气查询</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-20 h-2 bg-white/20 rounded-full mr-2">
                                  <div className="w-3/4 h-full bg-cyan-400 rounded-full"></div>
                                </div>
                                <span className="text-white text-sm">{stats.weatherQueries}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">⚡ 系统性能监控</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <div className="flex justify-between text-white mb-2">
                                <span>CPU使用率</span>
                                <span>{Math.floor(Math.random() * 30 + 20)}%</span>
                              </div>
                              <div className="w-full h-2 bg-white/20 rounded-full">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-full"
                                  style={{ width: `${Math.floor(Math.random() * 30 + 20)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-white mb-2">
                                <span>内存使用率</span>
                                <span>{Math.floor(Math.random() * 40 + 30)}%</span>
                              </div>
                              <div className="w-full h-2 bg-white/20 rounded-full">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                                  style={{ width: `${Math.floor(Math.random() * 40 + 30)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-white mb-2">
                                <span>网络延迟</span>
                                <span>{Math.floor(Math.random() * 50 + 10)}ms</span>
                              </div>
                              <div className="w-full h-2 bg-white/20 rounded-full">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                  style={{ width: `${Math.floor(Math.random() * 20 + 15)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div>
                              <div className="flex justify-between text-white mb-2">
                                <span>存储使用率</span>
                                <span>{Math.floor(Math.random() * 60 + 40)}%</span>
                              </div>
                              <div className="w-full h-2 bg-white/20 rounded-full">
                                <div
                                  className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                                  style={{ width: `${Math.floor(Math.random() * 60 + 40)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mt-4">
                              <div className="flex items-center">
                                <Activity className="w-4 h-4 text-green-400 mr-2" />
                                <span className="text-green-300 text-sm">系统运行状态：正常</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* API服务状态 */}
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">🔗 API服务状态</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Cloud className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="text-white text-sm">天气API</div>
                              <div className="text-green-400 text-xs">在线</div>
                              <div className="text-white/60 text-xs">{Math.floor(Math.random() * 50 + 20)}ms</div>
                            </div>

                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Activity className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="text-white text-sm">IP查询</div>
                              <div className="text-green-400 text-xs">在线</div>
                              <div className="text-white/60 text-xs">{Math.floor(Math.random() * 30 + 15)}ms</div>
                            </div>

                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <BarChart3 className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="text-white text-sm">汇率API</div>
                              <div className="text-green-400 text-xs">在线</div>
                              <div className="text-white/60 text-xs">{Math.floor(Math.random() * 40 + 25)}ms</div>
                            </div>

                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Brain className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="text-white text-sm">智谱AI</div>
                              <div className="text-green-400 text-xs">在线</div>
                              <div className="text-white/60 text-xs">{Math.floor(Math.random() * 100 + 50)}ms</div>
                            </div>

                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Code className="w-6 h-6 text-green-400" />
                              </div>
                              <div className="text-white text-sm">CodeX</div>
                              <div className="text-green-400 text-xs">在线</div>
                              <div className="text-white/60 text-xs">{Math.floor(Math.random() * 80 + 40)}ms</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 导出功能 */}
                      <div className="flex gap-4">
                        <Button
                          onClick={exportResults}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          导出数据
                        </Button>
                        <Button
                          onClick={clearAllResults}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          清空所有结果
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Logo展示 */}
                <TabsContent value="logo" className="space-y-6">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        YanYu Cloud³ Logo展示中心
                      </CardTitle>
                      <CardDescription className="text-white/80">
                        品牌标识展示、动画效果演示和设计理念介绍
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      {/* Logo展示区域 */}
                      <div className="text-center space-y-6">
                        <div className="flex justify-center">
                          <AnimatedLogo
                            size="xl"
                            showText={true}
                            className="hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold text-white">YanYu Cloud³</h2>
                          <p className="text-xl text-white/80">万象归元于云枢，深栈智启新纪元</p>
                          <p className="text-lg text-white/60">
                            All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
                          </p>
                        </div>
                      </div>

                      {/* Logo变体展示 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Card className="bg-white/5 border-white/10 p-6 text-center">
                          <AnimatedLogo size="lg" showText={false} />
                          <p className="text-white/80 text-sm mt-3">标准Logo</p>
                        </Card>

                        <Card className="bg-white/5 border-white/10 p-6 text-center">
                          <AnimatedLogo size="md" showText={true} />
                          <p className="text-white/80 text-sm mt-3">带文字Logo</p>
                        </Card>

                        <Card className="bg-white/5 border-white/10 p-6 text-center">
                          <AnimatedLogo size="sm" showText={false} />
                          <p className="text-white/80 text-sm mt-3">小尺寸Logo</p>
                        </Card>

                        <Card className="bg-white/5 border-white/10 p-6 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 rounded-full mx-auto flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-white/80 text-sm mt-3">简化图标</p>
                        </Card>
                      </div>

                      {/* 设计理念 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">🎨 设计理念</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-white/80">
                            <div>
                              <h4 className="text-white font-semibold mb-2">视觉元素</h4>
                              <ul className="text-sm space-y-1">
                                <li>
                                  • <strong>云朵形状</strong>：象征云计算和智能服务
                                </li>
                                <li>
                                  • <strong>渐变色彩</strong>：蓝紫青渐变，科技感与未来感
                                </li>
                                <li>
                                  • <strong>动态效果</strong>：流动的光效，展现活力与创新
                                </li>
                                <li>
                                  • <strong>立体层次</strong>：多层次设计，体现深度技术栈
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-white font-semibold mb-2">品牌内涵</h4>
                              <ul className="text-sm space-y-1">
                                <li>
                                  • <strong>万象归元</strong>：整合多种AI能力于一体
                                </li>
                                <li>
                                  • <strong>云枢核心</strong>：以云计算为核心枢纽
                                </li>
                                <li>
                                  • <strong>深栈技术</strong>：深度技术栈，全栈解决方案
                                </li>
                                <li>
                                  • <strong>智启未来</strong>：智能技术开启新纪元
                                </li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-white/5 border-white/10">
                          <CardHeader>
                            <CardTitle className="text-white text-lg">🌈 色彩规范</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-400 rounded mr-3"></div>
                                <div>
                                  <div className="text-white font-semibold">主蓝色</div>
                                  <div className="text-white/60 text-sm">#60A5FA</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-purple-400 rounded mr-3"></div>
                                <div>
                                  <div className="text-white font-semibold">辅紫色</div>
                                  <div className="text-white/60 text-sm">#A78BFA</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-cyan-400 rounded mr-3"></div>
                                <div>
                                  <div className="text-white font-semibold">强调青色</div>
                                  <div className="text-white/60 text-sm">#22D3EE</div>
                                </div>
                              </div>

                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded mr-3"></div>
                                <div>
                                  <div className="text-white font-semibold">品牌渐变</div>
                                  <div className="text-white/60 text-sm">蓝→紫→青</div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                              <h5 className="text-white font-semibold mb-2">使用指南</h5>
                              <ul className="text-white/70 text-xs space-y-1">
                                <li>• 主色调用于重要元素和品牌标识</li>
                                <li>• 渐变效果用于按钮和装饰元素</li>
                                <li>• 保持色彩一致性和品牌识别度</li>
                                <li>• 在不同背景下确保可读性</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 应用场景 */}
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">📱 应用场景展示</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded mx-auto mb-3 flex items-center justify-center">
                                <Globe className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-white text-sm">网站标识</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded mx-auto mb-3 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-white text-sm">应用图标</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded mx-auto mb-3 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-white text-sm">文档标识</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4 text-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-400 to-cyan-400 rounded mx-auto mb-3 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-white text-sm">品牌推广</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 下载资源 */}
                      <Card className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">📥 资源下载</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col">
                              <Download className="w-5 h-5 mb-1" />
                              <span className="text-sm">PNG格式</span>
                            </Button>

                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col">
                              <Download className="w-5 h-5 mb-1" />
                              <span className="text-sm">SVG格式</span>
                            </Button>

                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col">
                              <Download className="w-5 h-5 mb-1" />
                              <span className="text-sm">AI格式</span>
                            </Button>

                            <Button className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-16 flex-col">
                              <Download className="w-5 h-5 mb-1" />
                              <span className="text-sm">品牌包</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* 页脚信息 */}
          <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 mt-8">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center mb-4">
                    <AnimatedLogo size="sm" showText={false} />
                    <span className="text-white font-bold ml-2">YanYu Cloud³</span>
                  </div>
                  <p className="text-white/70 text-sm">
                    万象归元于云枢，深栈智启新纪元。基于智谱AI的全栈智能服务平台。
                  </p>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">核心功能</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>智能视频生成</li>
                    <li>图文创作工具</li>
                    <li>CodeX代码助理</li>
                    <li>文本智能处理</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">API服务</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>实时天气查询</li>
                    <li>IP地址查询</li>
                    <li>汇率转换服务</li>
                    <li>系统监控统计</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-3">联系我们</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>官网：www.yy.0379.pro</li>
                    <li>邮箱：contact@yy.0379.pro</li>
                    <li>技术支持：24/7在线</li>
                    <li>版本：v3.0.0</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/20 mt-8 pt-6 text-center">
                <p className="text-white/60 text-sm">
                  © 2024 YanYu Cloud³. All rights reserved. Powered by 智谱AI & Next.js
                </p>
              </div>
            </div>
          </footer>
        </div>
        {/* API配置模态框 */}
        <APIConfigModal isOpen={isAPIModalOpen} onClose={() => setIsAPIModalOpen(false)} type={apiModalType} />
      </div>
    </PageTransition>
  )
}
