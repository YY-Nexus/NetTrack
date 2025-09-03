"use client"

import { useWizard } from "./wizard-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { WizardNavigation } from "./wizard-navigation"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function StepAuthentication() {
  const { formData, updateFormData } = useWizard()
  const [authType, setAuthType] = useState(formData.authType || "apiKey")
  const [apiKey, setApiKey] = useState(formData.apiKey || "")
  const [clientId, setClientId] = useState(formData.clientId || "")
  const [clientSecret, setClientSecret] = useState(formData.clientSecret || "")
  const [showSecret, setShowSecret] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (authType === "apiKey") {
      setIsValid(!!apiKey.trim())
    } else if (authType === "oauth") {
      setIsValid(!!clientId.trim() && !!clientSecret.trim())
    }
  }, [authType, apiKey, clientId, clientSecret])

  const handleNext = () => {
    updateFormData({
      authType,
      apiKey,
      clientId,
      clientSecret,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>认证方式</Label>
          <RadioGroup value={authType} onValueChange={setAuthType} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="apiKey" id="apiKey" />
              <Label htmlFor="apiKey" className="cursor-pointer">
                API密钥
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oauth" id="oauth" />
              <Label htmlFor="oauth" className="cursor-pointer">
                OAuth 2.0
              </Label>
            </div>
          </RadioGroup>
        </div>

        {authType === "apiKey" ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="apiKey">
                API密钥 <span className="text-red-500">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">API密钥可在集成应用提供商的开发者控制台中获取</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="relative max-w-md">
              <Input
                id="apiKey"
                type={showSecret ? "text" : "password"}
                placeholder="输入API密钥"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">输入您从集成应用提供商获取的API密钥</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">
                客户端ID <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientId"
                placeholder="输入客户端ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">
                客户端密钥 <span className="text-red-500">*</span>
              </Label>
              <div className="relative max-w-md">
                <Input
                  id="clientSecret"
                  type={showSecret ? "text" : "password"}
                  placeholder="输入客户端密钥"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <WizardNavigation disableNext={!isValid} onComplete={handleNext} />
    </div>
  )
}
