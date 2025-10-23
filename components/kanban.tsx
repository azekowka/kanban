"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Column } from "@/components/column"
import { Sticker } from "@/components/sticker"
import { DotPattern } from "@/components/dot-pattern"
import type { StickerType, ColumnType } from "@/lib/types"

export default function KanBan() {
  const [columns, setColumns] = useState<ColumnType[]>([])
  const [stickers, setStickers] = useState<StickerType[]>([])
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [showColumnInput, setShowColumnInput] = useState(false)

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: ColumnType = {
        id: Date.now().toString(),
        title: newColumnTitle,
        emoji: "",
      }
      setColumns([...columns, newColumn])
      setNewColumnTitle("")
      setShowColumnInput(false)
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId))
  }

  const handleUpdateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, ...updates } : col)))
  }

  const handleAddSticker = (columnId: string, columnIndex: number) => {
    const newSticker: StickerType = {
      id: Date.now().toString(),
      text: "New task",
      color: "yellow",
      columnId,
      // Position sticker in the column area on the canvas
      position: { x: columnIndex * 400 + 50, y: 100 },
    }
    setStickers([...stickers, newSticker])
  }

  const handleUpdateSticker = (id: string, updates: Partial<StickerType>) => {
    setStickers(stickers.map((sticker) => (sticker.id === id ? { ...sticker, ...updates } : sticker)))
  }

  const handleDeleteSticker = (id: string) => {
    setStickers(stickers.filter((sticker) => sticker.id !== id))
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Kanban Board</h1>
        <div className="flex items-center gap-3">
          {showColumnInput ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Column name..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddColumn()}
                className="w-48"
                autoFocus
              />
              <Button onClick={handleAddColumn} size="sm">
                Add
              </Button>
              <Button onClick={() => setShowColumnInput(false)} variant="ghost" size="sm">
                Undo
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowColumnInput(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
            </Button>
          )}
        </div>
      </div>

      {/* Board - Changed to relative positioning for canvas layer */}
      <div className="flex-1 overflow-auto relative">
        <DotPattern
          className="text-muted-foreground [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          dotSize={1.5}
          dotSpacing={25}
        />

        {columns.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-lg mb-4">No columns yet</p>
              <Button onClick={() => setShowColumnInput(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add 1st Column
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="h-full flex absolute inset-0 pointer-events-none">
              {columns.map((column, index) => (
                <div key={column.id} className="flex pointer-events-auto">
                  <Column
                    column={column}
                    columnIndex={index}
                    onAddSticker={handleAddSticker}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateColumn={handleUpdateColumn}
                  />
                  {index < columns.length - 1 && <div className="w-px bg-border" />}
                </div>
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {stickers.map((sticker) => (
                <div key={sticker.id} className="pointer-events-auto">
                  <Sticker sticker={sticker} onUpdate={handleUpdateSticker} onDelete={handleDeleteSticker} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
