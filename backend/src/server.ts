import express, { Application } from 'express';
import { setupMiddleware } from './middleware/setup';
import { setupRoutes } from './router';
import errorMiddleware from './middleware/errorMiddleware';
import { Config } from './config/config';

export class Server {
  private app: Application;

  constructor(private config: Config) {
    this.app = express();
  }

  public async init(): Promise<void> {
    setupMiddleware(this.app, this.config);
    await this.setupRoutes();
    this.setupErrorHandling();
  }

  private async setupRoutes(): Promise<void> {
    const router = await setupRoutes();
    this.app.use(router);
  }

  private setupErrorHandling(): void {
    this.app.use(errorMiddleware);
  }

  public start(): void {
    this.app.listen(this.config.port, () => {
      console.log(`Server running on port ${this.config.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
} 