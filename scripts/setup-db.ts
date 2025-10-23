import { setupDatabase } from "../neon/action";

async function main() {
  try {
    await setupDatabase();
    console.log("Database setup complete.");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

main();
