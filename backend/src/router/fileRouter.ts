import { Router } from 'express';
import { FileController } from '../controller/file.controller';

const router = Router();
const fileController = new FileController();

router.get('/*', fileController.serveFile);

export const fileRouter = router; 