import { Router } from 'express';
import { notLoggedInRouter } from './notLoggedInRouter';
import { fileRouter } from './fileRouter';

export async function setupRoutes(): Promise<Router> {
  const router = Router();

  // Mount all routers without prefixes
  router.use(notLoggedInRouter); // TODO remove when dry run is converted
  router.use(fileRouter); // TODO remove when file download is converted

  return router;
} 