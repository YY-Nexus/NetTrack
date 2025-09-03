"use client"

import { useEffect, useRef } from "react"
import { categories } from "@/app/data/integrations"

type CategoryVisualizationProps = {
  onSelectCategory: (category: string, subcategory?: string) => void
}

export default function CategoryVisualization({ onSelectCategory }: CategoryVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布大小
    const setCanvasSize = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = 500
      }
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // 绘制分类可视化
    const drawCategories = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const filteredCategories = categories.filter((c) => c !== "全部分类")
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) * 0.7

      // 绘制中心圆
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(99, 102, 241, 0.8)"
      ctx.fill()

      ctx.fillStyle = "white"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("集成分类", centerX, centerY)

      // 绘制分类节点
      const angleStep = (Math.PI * 2) / filteredCategories.length

      filteredCategories.forEach((category, index) => {
        const angle = index * angleStep
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        // 绘制连接线
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = "rgba(156, 163, 175, 0.5)"
        ctx.stroke()

        // 绘制分类节点
        ctx.beginPath()
        ctx.arc(x, y, 30, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${(index * 360) / filteredCategories.length}, 70%, 65%)`
        ctx.fill()

        // 绘制分类名称
        ctx.fillStyle = "white"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"

        // 处理长文本
        const maxLength = 6
        if (category.length > maxLength) {
          const firstLine = category.substring(0, maxLength)
          const secondLine = category.substring(maxLength)
          ctx.fillText(firstLine, x, y - 6)
          ctx.fillText(secondLine, x, y + 6)
        } else {
          ctx.fillText(category, x, y)
        }

        // 为每个主分类添加点击事件区域
        const categoryArea = {
          x,
          y,
          radius: 30,
          category,
        }
        categoryAreas.push(categoryArea)
      })
    }

    // 存储可点击区域
    const categoryAreas: Array<{ x: number; y: number; radius: number; category: string }> = []

    // 处理点击事件
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // 检查是否点击了分类区域
      for (const area of categoryAreas) {
        const distance = Math.sqrt(Math.pow(x - area.x, 2) + Math.pow(y - area.y, 2))
        if (distance <= area.radius) {
          onSelectCategory(area.category)
          return
        }
      }
    }

    canvas.addEventListener("click", handleClick)

    drawCategories()

    return () => {
      window.removeEventListener("resize", setCanvasSize)
      canvas.removeEventListener("click", handleClick)
    }
  }, [onSelectCategory])

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">分类导航图</h3>
      <div className="w-full">
        <canvas ref={canvasRef} className="w-full" style={{ height: "500px" }}></canvas>
      </div>
    </div>
  )
}
