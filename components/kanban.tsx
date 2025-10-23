"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Input } from "@/components/ui/input";
import { Column } from "@/components/column";
import { Sticker } from "@/components/sticker";
import { DotPattern } from "@/components/dot-pattern";
import type { StickerType, ColumnType } from "@/lib/types";
import { getBoardState, saveBoardState } from "@/neon/action";

// Debounce function
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise((resolve) => {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

export default function KanBan() {
  const { user, isLoaded } = useUser();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [showColumnInput, setShowColumnInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (boardState) => {
      if (user) {
        await saveBoardState(boardState);
      }
    }, 1000),
    [user]
  );

  useEffect(() => {
    const loadBoardState = async () => {
      if (isLoaded) {
        if (user) {
          setIsLoading(true);
          const boardState = await getBoardState();
          if (boardState) {
            setColumns(boardState.columns || []);
            setStickers(boardState.stickers || []);
          }
        } else {
          // Guest user, use local storage or default state
          setColumns([]);
          setStickers([]);
        }
        setIsLoading(false);
      }
    };
    loadBoardState();
  }, [user, isLoaded]);

  useEffect(() => {
    if (!isLoading && isLoaded && user) {
      debouncedSave({ columns, stickers });
    }
  }, [columns, stickers, isLoading, isLoaded, user, debouncedSave]);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: ColumnType = {
        id: Date.now().toString(),
        title: newColumnTitle,
        emoji: "",
      };
      setColumns([...columns, newColumn]);
      setNewColumnTitle("");
      setShowColumnInput(false)
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    setStickers(stickers.filter((sticker) => sticker.columnId !== columnId));
  };

  const handleUpdateColumn = (columnId: string, updates: Partial<ColumnType>) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, ...updates } : col
      )
    );
  };

  const handleAddSticker = (columnId: string, columnIndex: number) => {
    const newSticker: StickerType = {
      id: Date.now().toString(),
      text: "New task",
      color: "yellow",
      columnId,
      position: { x: columnIndex * 320 + 40, y: 150 }, // Adjusted position
    };
    setStickers([...stickers, newSticker]);
  };

  const handleUpdateSticker = (id: string, updates: Partial<StickerType>) => {
    setStickers(
      stickers.map((sticker) =>
        sticker.id === id ? { ...sticker, ...updates } : sticker
      )
    );
  };

  const handleDeleteSticker = (id: string) => {
    setStickers(stickers.filter((sticker) => sticker.id !== id));
  };

  if (isLoading && isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p>Loading your board...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <RainbowButton>Sign In</RainbowButton>
            </SignInButton>
          </SignedOut>
          <h1 className="text-2xl font-semibold text-foreground">
            Kanban Board
          </h1>
        </div>
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
              <p className="text-muted-foreground text-lg mb-4">
                Your board is empty.
              </p>
              <Button onClick={() => setShowColumnInput(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add 1st column
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
                    onAddSticker={() => handleAddSticker(column.id, index)}
                    onDeleteColumn={handleDeleteColumn}
                    onUpdateColumn={handleUpdateColumn}
                  />
                  {index < columns.length - 1 && (
                    <div className="w-px bg-border h-full" />
                  )}
                </div>
              ))}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {stickers.map((sticker) => (
                <div key={sticker.id} className="pointer-events-auto">
                  <Sticker
                    sticker={sticker}
                    onUpdate={handleUpdateSticker}
                    onDelete={handleDeleteSticker}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
