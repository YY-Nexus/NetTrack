"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OllamaControlPanel } from "./ollama-control-panel"
import { ModelMixerPanel } from "./model-mixer-panel"
import { APIConfigModal } from "./api-config-modal"
import { Settings, Cpu, Shuffle, Cloud } from "lucide-react"

interface EnhancedAPIConfigModalProps {
  isOpen: boolean
  onClose: () => void
  type: "cloud" | "local"
}

export function EnhancedAPIConfigModal({ isOpen, onClose, type }: EnhancedAPIConfigModalProps) {
  const [activeTab, setActiveTab] = useState(type === "local" ? "ollama" : "cloud")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-900/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            API配置管理中心
          </DialogTitle>
          <DialogDescription className="text-white/80">统一管理云端API、本地Ollama服务和混合调用配置</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
            <TabsTrigger
              value="cloud"
              className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
            >
              <Cloud className="w-4 h-4 mr-2" />
              云端API
            </TabsTrigger>
            <TabsTrigger
              value="ollama"
              className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
            >
              <Cpu className="w-4 h-4 mr-2" />
              Ollama控制
            </TabsTrigger>
            <TabsTrigger
              value="mixer"
              className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              混合调用
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-white/30 text-white data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              高级设置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cloud" className="mt-6">
            <APIConfigModal isOpen={true} onClose={() => {}} type="cloud" />
          </TabsContent>

          <TabsContent value="ollama" className="mt-6">
            <OllamaControlPanel />
          </TabsContent>

          <TabsContent value="mixer" className="mt-6">
            <ModelMixerPanel />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <div className="text-center py-12 text-white/60">
                <Settings className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">高级设置</h3>
                <p>更多高级配置选项正在开发中...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
