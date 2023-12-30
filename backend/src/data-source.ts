import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432",
  database: "motticon",
  logging: true,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.ts"],
  migrationsRun: true,
});
