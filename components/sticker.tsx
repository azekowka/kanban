"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { StickerType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StickerProps {
  sticker: StickerType
  onUpdate: (id: string, updates: Partial<StickerType>) => void
  onDelete: (id: string) => void
}

const colorClasses = {
  green: "bg-[var(--sticker-green)] text-foreground",
  purple: "bg-[var(--sticker-purple)] text-foreground",
  yellow: "bg-[var(--sticker-yellow)] text-foreground",
  white: "bg-[var(--sticker-white)] text-foreground border border-border",
}

export function Sticker({ sticker, onUpdate, onDelete }: StickerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(sticker.text)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - sticker.position.x,
      y: e.clientY - sticker.position.y,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newX = e.clientX - dragStartPos.current.x
      const newY = e.clientY - dragStartPos.current.y
      onUpdate(sticker.id, { position: { x: newX, y: newY } })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, sticker.id, onUpdate])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (text.trim()) {
      onUpdate(sticker.id, { text })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleBlur()
    }
  }

  const cycleColor = () => {
    const colors: Array<"green" | "purple" | "yellow" | "white"> = ["green", "purple", "yellow", "white"]
    const currentIndex = colors.indexOf(sticker.color)
    const nextColor = colors[(currentIndex + 1) % colors.length]
    onUpdate(sticker.id, { color: nextColor })
  }

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute w-36 h-36 rounded-lg shadow-md cursor-move select-none transition-shadow hover:shadow-lg group",
        colorClasses[sticker.color],
        isDragging && "shadow-xl scale-105",
      )}
      style={{
        left: `${sticker.position.x}px`,
        top: `${sticker.position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={(e) => {
            e.stopPropagation()
            cycleColor()
          }}
          size="icon"
          variant="ghost"
          className="h-6 w-6"
        >
          <div className="w-3 h-3 rounded-full bg-foreground/20" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(sticker.id)
          }}
          size="icon"
          variant="ghost"
          className="h-6 w-6 text-destructive"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <div className="p-3 h-full flex items-center justify-center">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent border-none outline-none resize-none text-sm text-center"
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <p className="text-sm text-center break-words">{sticker.text}</p>
        )}
      </div>
    </div>
  )
}
