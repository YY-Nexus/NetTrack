"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { APIStatusIndicator } from "@/components/api-status-indicator"
import { AnimatedLogo, StreamingText } from "./animated-logo"
import { Rocket, Menu, X } from "lucide-react"

interface ResponsiveHeaderProps {
  onLogoClick?: () => void
}

export function ResponsiveHeader({ onLogoClick }: ResponsiveHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo区域 */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <AnimatedLogo size="md" showText={false} onClick={onLogoClick} className="transition-all duration-300" />
            <div className="hidden sm:block">
              <StreamingText text="YanYu Cloud³ Platform" size="lg" className="font-bold" />
            </div>
          </div>

          {/* 桌面端右侧内容 */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* API状态指示器 */}
            <div className="flex flex-wrap gap-1 xl:gap-2">
              <APIStatusIndicator service="天气" enabled={true} status="online" />
              <APIStatusIndicator service="IP查询" enabled={true} status="online" />
              <APIStatusIndicator service="汇率" enabled={true} status="online" />
              <APIStatusIndicator service="智谱AI" enabled={true} status="online" />
              <APIStatusIndicator service="CodeX" enabled={true} status="online" />
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Rocket className="w-4 h-4 mr-2" />
              立即体验
            </Button>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4 space-y-4">
            <div className="text-center">
              <StreamingText text="YanYu Cloud³ Platform" size="lg" className="font-bold" />
            </div>

            {/* 移动端API状态 */}
            <div className="grid grid-cols-2 gap-2">
              <APIStatusIndicator service="天气" enabled={true} status="online" />
              <APIStatusIndicator service="IP查询" enabled={true} status="online" />
              <APIStatusIndicator service="汇率" enabled={true} status="online" />
              <APIStatusIndicator service="智谱AI" enabled={true} status="online" />
            </div>

            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Rocket className="w-4 h-4 mr-2" />
              立即体验
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
