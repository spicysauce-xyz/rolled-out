import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const run = async () => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  const db = drizzle(url);

  console.log("Migrating database...");
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("Migration complete");
  } catch (error) {
    console.error("Migration failed");
    console.error(error);
  }
};

run();
