import { AppDataSource } from "./data-source";
import { Server } from "./server";
import { loadConfig } from "./config/config";
import { setupDatabase } from "./data-source";
import { Container } from "typedi";
import { PodScoreBackfillService } from "./service/podScoreBackfill.service";
import "./container"; // Initialize container with all service registrations

async function bootstrap() {
  try {
    const config = loadConfig();

    // Initialize database
    await AppDataSource.initialize();
    await setupDatabase(AppDataSource);

    // Run pod score backfill job (non-blocking)
    const backfillService = Container.get<PodScoreBackfillService>(
      "PodScoreBackfillService"
    );
    backfillService.backfillPodScores().catch((error) => {
      console.error("Pod score backfill job failed:", error);
      // Don't exit - allow server to start even if backfill fails
    });

    // Create and start server
    const server = new Server(config);
    await server.init();
    server.start();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
