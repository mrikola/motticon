import { Router } from 'express';
import { adminRouter } from './adminRouter';
import { userRouter } from './userRouter';
import { notLoggedInRouter } from './notLoggedInRouter';
import { staffRouter } from './staffRouter';
import { fileRouter } from './fileRouter';

export async function setupRoutes(): Promise<Router> {
  const router = Router();

  // Mount all routes with proper prefixes
  router.use('/auth', notLoggedInRouter);
  router.use('/user', userRouter);
  router.use('/staff', staffRouter);
  router.use('/admin', adminRouter);
  router.use('/files', fileRouter);

  return router;
} 