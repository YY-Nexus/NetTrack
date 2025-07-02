import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YanYu Cloud³ | 万象归元于云枢，深栈智启新纪元",
  description: "言语云³ - 全栈云计算平台，提供云服务器、AI智能、数据库、网络安全等企业级解决方案",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
