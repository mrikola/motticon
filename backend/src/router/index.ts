import { Router } from 'express';
import { adminRouter } from './adminRouter';
import { userRouter } from './userRouter';
import { notLoggedInRouter } from './notLoggedInRouter';
import { staffRouter } from './staffRouter';
import { fileRouter } from './fileRouter';

export async function setupRoutes(): Promise<Router> {
  const router = Router();

  // Mount all routers without prefixes
  router.use(notLoggedInRouter);
  router.use(userRouter);
  router.use(staffRouter);
  router.use(adminRouter);
  router.use(fileRouter);

  return router;
} 