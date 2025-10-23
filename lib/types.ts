export interface StickerType {
  id: string
  text: string
  color: "green" | "purple" | "yellow" | "white"
  columnId: string
  position: { x: number; y: number }
}

export interface ColumnType {
  id: string
  title: string
  emoji: string
}
