"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ColumnType } from "@/lib/types"

interface ColumnProps {
  column: ColumnType
  onAddSticker: () => void
  onDeleteColumn: (columnId: string) => void
  onUpdateColumn: (columnId: string, updates: Partial<ColumnType>) => void
}

export function Column({ column, onAddSticker, onDeleteColumn, onUpdateColumn }: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(column.title)

  const handleTitleSave = () => {
    if (editedTitle.trim()) {
      onUpdateColumn(column.id, { title: editedTitle })
      setIsEditingTitle(false)
    }
  }

  const handleTitleCancel = () => {
    setEditedTitle(column.title)
    setIsEditingTitle(false)
  }

  return (
    <div className="flex-shrink-0 w-[400px] h-full flex flex-col">
      {/* Column Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-background">
        {isEditingTitle ? (
          <div className="flex items-center gap-2 flex-1">
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave()
                if (e.key === "Escape") handleTitleCancel()
              }}
              className="h-8"
              autoFocus
            />
            <Button onClick={handleTitleSave} size="sm" variant="ghost">
              Save
            </Button>
            <Button onClick={handleTitleCancel} size="sm" variant="ghost">
              Undo
            </Button>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span>{column.title}</span>
            <span>{column.emoji}</span>
          </h2>
        )}
        <div className="flex items-center gap-2">
          {!isEditingTitle && (
            <Button
              onClick={() => setIsEditingTitle(true)}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={onAddSticker} size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDeleteColumn(column.id)}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-background/50" />
    </div>
  )
}
