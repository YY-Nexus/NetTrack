interface SpinnerProps {
  size?: "small" | "medium" | "large"
  className?: string
}

export function Spinner({ size = "medium", className = "" }: SpinnerProps) {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div
      className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} ${className}`}
      aria-label="加载中"
    ></div>
  )
}
