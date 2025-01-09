import { Router } from 'express';
import { notLoggedInRouter } from './notLoggedInRouter';

export async function setupRoutes(): Promise<Router> {
  const router = Router();

  // Mount all routers without prefixes
  router.use(notLoggedInRouter); // TODO remove when dry run is converted

  return router;
} 