"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  onClick?: () => void
  className?: string
}

export function AnimatedLogo({ size = "md", showText = false, onClick, className }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
    xl: "w-24 h-24",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const handleClick = () => {
    setIsClicked(true)

    // 创建粒子效果
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }))
    setParticles(newParticles)

    // 清除粒子
    setTimeout(() => setParticles([]), 1000)

    // 重置点击状态
    setTimeout(() => setIsClicked(false), 700)

    onClick?.()
  }

  return (
    <div className={cn("relative flex items-center space-x-3", className)}>
      {/* Logo容器 */}
      <div
        className={cn(
          "relative cursor-pointer transition-all duration-500 ease-out",
          sizeClasses[size],
          "logo-float",
          isHovered && "logo-hover",
          isClicked && "logo-click",
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* 发光光晕 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-0 blur-xl transition-opacity duration-300 logo-glow" />

        {/* Logo图像 */}
        <div className="relative z-10 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
          <Image
            src="/images/yanyu-logo.png"
            alt="YanYu Cloud Logo"
            width={96}
            height={96}
            className="w-full h-full object-contain p-1"
            priority
          />
        </div>

        {/* 粒子效果 */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"
            style={{
              left: `50%`,
              top: `50%`,
              transform: `translate(${particle.x}px, ${particle.y}px)`,
              animationDuration: "1s",
              animationFillMode: "forwards",
            }}
          />
        ))}
      </div>

      {/* 文字标识 - 流光溢彩效果 */}
      {showText && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold transition-all duration-300 streaming-text",
              textSizeClasses[size],
              isHovered && "text-glow",
            )}
          >
            YanYu Cloud³
          </span>
        </div>
      )}
    </div>
  )
}

// 流光文字组件
interface StreamingTextProps {
  text: string
  className?: string
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
}

export function StreamingText({ text = "YanYu Cloud³ Platform", className, size = "xl" }: StreamingTextProps) {
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <span
        key={animationKey}
        className={cn(
          "font-bold bg-gradient-to-r from-blue-400 via-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-streaming-gradient bg-[length:200%_100%]",
          sizeClasses[size],
        )}
      >
        {text}
      </span>

      {/* 流光效果叠加层 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-streaming-light opacity-0" />
    </div>
  )
}

// 页面切换动画组件
interface PageTransitionProps {
  children: React.ReactNode
  isTransitioning: boolean
}

export function PageTransition({ children, isTransitioning }: PageTransitionProps) {
  return (
    <div className={cn("transition-all duration-700 ease-in-out", isTransitioning && "page-transition")}>
      {children}
    </div>
  )
}
