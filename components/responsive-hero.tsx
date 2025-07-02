"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StreamingText } from "./animated-logo"
import { Sparkles, Server, Cpu, Activity, Zap, Video, Brain } from "lucide-react"

interface ResponsiveHeroProps {
  stats: {
    cloudApiCalls: number
    localApiCalls: number
    uptime: number
    totalOperations: number
    videoGenerated: number
    codeGenerated: number
  }
  onCloudApiClick: () => void
  onLocalApiClick: () => void
}

export function ResponsiveHero({ stats, onCloudApiClick, onLocalApiClick }: ResponsiveHeroProps) {
  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-6 sm:mb-8">
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-white/30 mb-4 text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            智能视频 + 图文创作 + CodeX助理
          </Badge>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            万象归元于
            <div className="mt-2">
              <StreamingText text="云枢" size="3xl" />
            </div>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-2 sm:mb-4">深栈智启新纪元</p>
          <p className="text-sm sm:text-base lg:text-lg text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            All Realms Converge at Cloud Nexus, DeepStack Ignites a New Era
          </p>
        </div>

        {/* 实时统计 - 响应式网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 max-w-5xl mx-auto mb-8 sm:mb-12">
          <Card
            className="bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300/30 tech-indicator cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onCloudApiClick}
          >
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Server className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1 data-sync-animation">
                {stats.cloudApiCalls.toLocaleString()}+
              </div>
              <div className="text-blue-100 text-xs sm:text-sm">统一大模型API</div>
              <div className="text-blue-200 text-xs mt-1 hidden sm:block">点击配置</div>
            </CardContent>
          </Card>

          <Card
            className="bg-gradient-to-br from-green-400 to-green-600 border-green-300/30 tech-indicator cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onLocalApiClick}
          >
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Cpu className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1 data-sync-animation">
                {stats.localApiCalls.toLocaleString()}+
              </div>
              <div className="text-green-100 text-xs sm:text-sm">本地大模型API</div>
              <div className="text-green-200 text-xs mt-1 hidden sm:block">点击配置</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300/30 tech-indicator">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Activity className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1">{stats.uptime.toFixed(1)}%</div>
              <div className="text-purple-100 text-xs sm:text-sm">系统可用性</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300/30 interactive-element">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Zap className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1">{stats.totalOperations}</div>
              <div className="text-orange-100 text-xs sm:text-sm">总操作数</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-400 to-pink-600 border-pink-300/30 interactive-element">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Video className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1">{stats.videoGenerated}</div>
              <div className="text-pink-100 text-xs sm:text-sm">视频生成</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300/30 interactive-element">
            <CardContent className="p-2 sm:p-4 text-center">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Brain className="w-3 h-3 sm:w-5 sm:h-5 text-white mr-1 sm:mr-2" />
              </div>
              <div className="text-sm sm:text-2xl font-bold text-white mb-1">{stats.codeGenerated}</div>
              <div className="text-cyan-100 text-xs sm:text-sm">代码生成</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
