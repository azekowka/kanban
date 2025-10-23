"use server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export type BoardState = {
  columns: any[];
  stickers: any[];
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}
const sql = neon(process.env.DATABASE_URL);

export async function getBoardState() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  try {
    const response = await sql`
      SELECT columns, stickers FROM kanban_state WHERE user_id = ${userId}
    `;
    if (response.length === 0) {
      return { columns: [], stickers: [] };
    }
    return response[0] as BoardState;
  } catch (error) {
    console.error("Failed to fetch board state:", error);
    return null;
  }
}

export async function saveBoardState(boardState: BoardState) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const { columns, stickers } = boardState;

  try {
    await sql`
      INSERT INTO kanban_state (user_id, columns, stickers)
      VALUES (${userId}, ${JSON.stringify(columns)}, ${JSON.stringify(
      stickers
    )})
      ON CONFLICT (user_id) DO UPDATE
      SET columns = ${JSON.stringify(
        columns
      )}, stickers = ${JSON.stringify(stickers)}, updated_at = NOW()
    `;
  } catch (error) {
    console.error("Failed to save board state:", error);
    throw new Error("Could not save board state.");
  }
}

export async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS kanban_state (
        user_id VARCHAR(255) PRIMARY KEY,
        columns JSONB,
        stickers JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("Database setup completed successfully.");
  } catch (error) {
    console.error("Database setup failed:", error);
    throw new Error("Could not set up the database.");
  }
}