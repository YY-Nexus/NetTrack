"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "ai/react"
import { AssistantMessage } from "./assistant-message"
import { QuickQuestions } from "./quick-questions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Maximize2, Minimize2, Volume2, VolumeX, RefreshCw, Send, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { IntegrationRecommendation } from "./integration-recommendation"

interface AssistantPanelProps {
  onClose: () => void
}

export function AssistantPanel({ onClose }: AssistantPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [inputMode, setInputMode] = useState<"simple" | "advanced">("simple")
  const [showRecommendations, setShowRecommendations] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append, reload, stop, error } =
    useChat({
      api: "/api/chat",
      onResponse: () => {
        if (soundEnabled) {
          const audio = new Audio("/sounds/message.mp3")
          audio.volume = 0.5
          audio.play().catch((e) => console.error("播放声音失败:", e))
        }

        // 当收到回复时，显示推荐
        if (messages.length > 1) {
          setShowRecommendations(true)
        }
      },
    })

  const handleQuickQuestion = (question: string) => {
    append({ role: "user", content: question })
  }

  const clearChat = () => {
    setMessages([])
    setShowRecommendations(false)
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // 初始欢迎消息
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content:
            "您好！我是言语云³集成助手，可以帮助您了解各种集成应用、解决集成问题，并提供相关建议。请问有什么可以帮助您的？",
        },
      ])
    }
  }, [messages.length, setMessages])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className={cn("fixed bottom-4 right-4 z-50 w-full max-w-md shadow-2xl", expanded && "top-20 max-w-2xl")}
      >
        <Card className="border-2 border-primary/20 overflow-hidden">
          <CardHeader className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">AI</span>
                </div>
                集成智能助手
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowRecommendations(!showRecommendations)}
                  className={cn(showRecommendations && "text-primary")}
                >
                  <Lightbulb className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setExpanded(!expanded)}>
                  {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="chat">对话</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="m-0">
              {showRecommendations && messages.length > 1 && (
                <IntegrationRecommendation
                  messages={messages}
                  onClose={() => setShowRecommendations(false)}
                  className="mx-4 mt-4"
                />
              )}

              <div
                className={cn("overflow-y-auto p-4 space-y-4 bg-white", expanded ? "h-[calc(100vh-280px)]" : "h-80")}
              >
                {messages.map((message) => (
                  <AssistantMessage
                    key={message.id}
                    content={message.content}
                    role={message.role as "user" | "assistant"}
                  />
                ))}
                {isLoading && <AssistantMessage content="" role="assistant" isLoading />}
                <div ref={messagesEndRef} />
              </div>

              <CardFooter className="flex flex-col p-4 pt-2 gap-2 border-t">
                <QuickQuestions onSelectQuestion={handleQuickQuestion} />

                {inputMode === "simple" ? (
                  <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="输入您的问题..."
                      className="flex-grow"
                      disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="w-full space-y-2">
                    <Textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="输入您的详细问题..."
                      className="min-h-24 resize-none"
                      disabled={isLoading}
                    />
                    <div className="flex justify-between">
                      <Button type="button" variant="outline" size="sm" onClick={() => setInputMode("simple")}>
                        简单模式
                      </Button>
                      <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
                        发送
                      </Button>
                    </div>
                  </form>
                )}

                <div className="flex justify-between w-full mt-2 text-xs text-gray-500">
                  <button
                    onClick={() => setInputMode(inputMode === "simple" ? "advanced" : "simple")}
                    className="hover:underline"
                  >
                    {inputMode === "simple" ? "高级模式" : "简单模式"}
                  </button>
                  <button onClick={clearChat} className="hover:underline flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> 清空对话
                  </button>
                </div>
              </CardFooter>
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <div className={cn("p-4 space-y-4 bg-white", expanded ? "h-[calc(100vh-280px)]" : "h-80")}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sound">声音提示</Label>
                      <p className="text-xs text-gray-500">收到新消息时播放提示音</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="recommendations">智能推荐</Label>
                      <p className="text-xs text-gray-500">根据对话内容推荐相关集成应用</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <Switch
                        id="recommendations"
                        checked={showRecommendations}
                        onCheckedChange={setShowRecommendations}
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">关于助手</h3>
                    <p className="text-xs text-gray-500">
                      言语云³集成助手是一个智能AI助手，可以帮助您了解各种集成应用、解决集成问题，并提供相关建议。
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">常见问题</h3>
                    <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                      <li>如何添加新的集成应用？</li>
                      <li>如何连接数据库集成？</li>
                      <li>如何解决集成同步问题？</li>
                      <li>如何查看集成使用统计？</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
