"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedLogo } from "./animated-logo"
import { Sparkles, Zap, Palette, Settings } from "lucide-react"

export function LogoShowcase() {
  const [selectedSize, setSelectedSize] = useState<"sm" | "md" | "lg" | "xl">("md")
  const [showText, setShowText] = useState(true)
  const [animationCount, setAnimationCount] = useState(0)

  const handleLogoClick = () => {
    setAnimationCount((prev) => prev + 1)
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          YanYu Cloud³ Logo 动画展示中心
        </CardTitle>
        <CardDescription className="text-white/80">
          体验我们精心设计的3D立体Logo动画效果，包含悬停、点击和粒子特效
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo展示区域 */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/50 rounded-xl p-8 border border-white/10 backdrop-blur-sm">
              <div className="flex flex-col items-center justify-center space-y-6 min-h-[300px]">
                <div className="text-center">
                  <h3 className="text-white text-lg font-semibold mb-2">主Logo展示</h3>
                  <p className="text-white/70 text-sm">点击Logo体验翻页动画效果</p>
                </div>

                <AnimatedLogo
                  size={selectedSize}
                  showText={showText}
                  onClick={handleLogoClick}
                  className="transform-gpu"
                />

                <div className="text-center space-y-2">
                  <Badge variant="outline" className="border-white/30 text-white/90">
                    <Zap className="w-3 h-3 mr-1" />
                    动画次数: {animationCount}
                  </Badge>
                  <p className="text-white/60 text-xs">悬停查看光晕效果，点击触发粒子动画</p>
                </div>
              </div>
            </div>

            {/* 多尺寸展示 */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <Palette className="w-4 h-4 mr-2" />
                多尺寸预览
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {(["sm", "md", "lg", "xl"] as const).map((size) => (
                  <div key={size} className="text-center space-y-2">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-center justify-center">
                      <AnimatedLogo size={size} />
                    </div>
                    <span className="text-white/70 text-xs uppercase">{size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 控制面板 */}
          <div className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  动画控制面板
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium mb-3 block">Logo尺寸</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["sm", "md", "lg", "xl"] as const).map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "text-xs",
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-500"
                            : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20",
                        )}
                      >
                        {size.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white text-sm font-medium mb-3 block">显示选项</label>
                  <Button
                    variant={showText ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowText(!showText)}
                    className={cn(
                      "w-full",
                      showText
                        ? "bg-green-600 text-white border-green-500"
                        : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20",
                    )}
                  >
                    {showText ? "隐藏文字" : "显示文字"}
                  </Button>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h5 className="text-white text-sm font-medium mb-2">动画特效说明</h5>
                  <div className="space-y-2 text-xs text-white/70">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>浮动动画：持续的轻柔上下浮动</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>悬停效果：缩放和发光光晕</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span>点击动画：360度翻页翻转</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>粒子特效：点击时的爆发效果</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 技术规格 */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">技术规格</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>图像格式:</span>
                  <span className="text-blue-300">PNG (透明背景)</span>
                </div>
                <div className="flex justify-between">
                  <span>动画引擎:</span>
                  <span className="text-green-300">CSS3 + React</span>
                </div>
                <div className="flex justify-between">
                  <span>响应式:</span>
                  <span className="text-purple-300">完全支持</span>
                </div>
                <div className="flex justify-between">
                  <span>性能优化:</span>
                  <span className="text-cyan-300">GPU加速</span>
                </div>
                <div className="flex justify-between">
                  <span>兼容性:</span>
                  <span className="text-yellow-300">现代浏览器</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 使用指南 */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-300/20">
          <CardHeader>
            <CardTitle className="text-white">🎯 使用指南</CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 space-y-2 text-sm">
            <p>
              • <strong>悬停体验</strong>：将鼠标悬停在Logo上查看缩放和发光效果
            </p>
            <p>
              • <strong>点击动画</strong>：点击Logo触发360度翻页动画和粒子爆发
            </p>
            <p>
              • <strong>尺寸调节</strong>：使用控制面板切换不同尺寸预览
            </p>
            <p>
              • <strong>文字切换</strong>：可选择显示或隐藏Logo旁边的文字标识
            </p>
            <p>
              • <strong>响应式</strong>：Logo在不同设备上都能完美显示和交互
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ")
}
