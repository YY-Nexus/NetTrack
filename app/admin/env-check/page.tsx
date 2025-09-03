"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, CopyIcon, RefreshCwIcon, PlusIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EnvVariable {
  key: string
  value: string
  type: "public" | "server" | "missing" | "custom"
  status: "ok" | "warning" | "error"
  description?: string
}

export default function EnvironmentVariablesCheck() {
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")
  const { toast } = useToast()

  // 预期的环境变量列表
  const expectedVariables = [
    {
      key: "NEXT_PUBLIC_APP_VERSION",
      type: "public",
      description: "应用版本号，由构建脚本自动生成",
    },
    {
      key: "NEXT_PUBLIC_BUILD_DATE",
      type: "public",
      description: "应用构建日期，由构建脚本自动生成",
    },
    // 可以添加更多预期的环境变量
  ]

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  const checkEnvironmentVariables = () => {
    setIsLoading(true)

    // 收集所有可用的环境变量
    const variables: EnvVariable[] = []

    // 检查预期的环境变量
    expectedVariables.forEach((expected) => {
      const value = process.env[expected.key] || ""

      variables.push({
        key: expected.key,
        value: value,
        type: expected.type as "public" | "server",
        status: value ? "ok" : "error",
        description: expected.description,
      })
    })

    // 检查其他可用的公共环境变量
    Object.keys(process.env).forEach((key) => {
      if (key.startsWith("NEXT_PUBLIC_") && !variables.some((v) => v.key === key)) {
        variables.push({
          key,
          value: process.env[key] || "",
          type: "public",
          status: "ok",
        })
      }
    })

    setEnvVariables(variables)
    setIsLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "已复制到剪贴板",
      description: "环境变量信息已成功复制",
    })
  }

  const addCustomVariable = () => {
    if (!newEnvKey || !newEnvValue) {
      toast({
        title: "输入错误",
        description: "请输入环境变量的键和值",
        variant: "destructive",
      })
      return
    }

    // 在客户端，我们不能真正添加环境变量，但可以模拟添加
    setEnvVariables([
      ...envVariables,
      {
        key: newEnvKey,
        value: newEnvValue,
        type: "custom",
        status: "warning",
        description: "客户端添加的自定义变量（仅供参考，需在服务器端配置）",
      },
    ])

    setNewEnvKey("")
    setNewEnvValue("")

    toast({
      title: "添加成功",
      description: "自定义环境变量已添加到列表（仅供参考）",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
      case "error":
        return <AlertTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "public":
        return (
          <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200">
            公共
          </Badge>
        )
      case "server":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            服务端
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            缺失
          </Badge>
        )
      case "custom":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            自定义
          </Badge>
        )
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">环境变量检查工具</CardTitle>
              <CardDescription className="text-sky-100 mt-2">查看和管理当前项目中的环境变量配置</CardDescription>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={checkEnvironmentVariables}
              disabled={isLoading}
            >
              <RefreshCwIcon className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <InfoIcon className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">关于环境变量</AlertTitle>
            <AlertDescription className="text-blue-700">
              环境变量用于存储配置信息，如API密钥、数据库连接字符串等。以{" "}
              <code className="bg-blue-100 px-1 rounded">NEXT_PUBLIC_</code> 开头的环境变量可在客户端访问。
            </AlertDescription>
          </Alert>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[50px]">状态</TableHead>
                  <TableHead className="w-[200px]">变量名</TableHead>
                  <TableHead className="w-[100px]">类型</TableHead>
                  <TableHead>值</TableHead>
                  <TableHead className="w-[250px]">描述</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {envVariables.map((variable) => (
                  <TableRow key={variable.key}>
                    <TableCell>{getStatusIcon(variable.status)}</TableCell>
                    <TableCell className="font-mono text-sm">{variable.key}</TableCell>
                    <TableCell>{getTypeBadge(variable.type)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {variable.value ? (
                        variable.value.length > 30 ? (
                          `${variable.value.substring(0, 30)}...`
                        ) : (
                          variable.value
                        )
                      ) : (
                        <span className="text-red-500">未设置</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">{variable.description || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`${variable.key}=${variable.value}`)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6">
          <div className="text-sm text-gray-500">
            检测到 {envVariables.length} 个环境变量，
            {envVariables.filter((v) => v.status === "ok").length} 个正常，
            {envVariables.filter((v) => v.status === "warning").length} 个警告，
            {envVariables.filter((v) => v.status === "error").length} 个错误
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800">
                <PlusIcon className="h-4 w-4 mr-2" />
                添加自定义变量
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加自定义环境变量</DialogTitle>
                <DialogDescription>
                  添加的变量仅在此会话中可见，不会永久保存。要永久添加环境变量，请修改项目根目录中的 .env.local 文件。
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="envKey" className="text-right">
                    变量名
                  </Label>
                  <Input
                    id="envKey"
                    value={newEnvKey}
                    onChange={(e) => setNewEnvKey(e.target.value)}
                    placeholder="例如: NEXT_PUBLIC_API_URL"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="envValue" className="text-right">
                    变量值
                  </Label>
                  <Input
                    id="envValue"
                    value={newEnvValue}
                    onChange={(e) => setNewEnvValue(e.target.value)}
                    placeholder="例如: https://api.example.com"
                    className="col-span-3"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button onClick={addCustomVariable}>添加变量</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}
