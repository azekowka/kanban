import { cn } from "@/lib/utils"

interface DotPatternProps {
  className?: string
  dotSize?: number
  dotSpacing?: number
  dotColor?: string
}

export function DotPattern({ className, dotSize = 1, dotSpacing = 20, dotColor = "currentColor" }: DotPatternProps) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dot-pattern" x="0" y="0" width={dotSpacing} height={dotSpacing} patternUnits="userSpaceOnUse">
          <circle cx={dotSpacing } cy={dotSpacing / 1.5} r={dotSize} fill={dotColor} opacity="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  )
}
