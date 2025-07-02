"use client"

import { AnimatedLogo } from "./animated-logo"

export function ResponsiveFooter() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/20 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <AnimatedLogo size="sm" showText={false} />
              <span className="text-white font-bold ml-2">YanYu Cloud³</span>
            </div>
            <p className="text-white/70 text-sm">万象归元于云枢，深栈智启新纪元。基于智谱AI的全栈智能服务平台。</p>
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
            <h4 className="text-white font-semibold mb-3">技术支持</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>智谱AI驱动</li>
              <li>Next.js框架</li>
              <li>24/7在线服务</li>
              <li>版本：v3.0.0</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 sm:mt-8 pt-4 sm:pt-6 text-center">
          <p className="text-white/60 text-sm">© 2024 YanYu Cloud³. All rights reserved. Powered by 智谱AI & Next.js</p>
        </div>
      </div>
    </footer>
  )
}
