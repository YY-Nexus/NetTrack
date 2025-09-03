// 模拟数据库服务
export const db = {
  // 空对象，不再尝试连接数据库
}

// 处理数据库错误
export function handleDbError(error: any, operation: string): Error {
  console.error(`数据库操作失败 (${operation}):`, error)
  return new Error(`数据库操作失败: ${error.message || "未知错误"}`)
}
