import { Request, Response } from 'express';
import { existsSync } from 'fs';
import path from 'path';
import { FILE_ROOT } from '../util/fs';
import { FileService } from '../services/file.service';

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  public serveFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const filePath = await this.fileService.getFilePath(req.path);
      res.sendFile(filePath, {
        headers: {
          'Content-Disposition': 'inline',
        },
      });
    } catch (error) {
      if (error.statusCode === 404) {
        res.sendFile(path.join(__dirname, '..', '..', 'README.md'), {
          headers: {
            'Content-Disposition': 'inline',
          },
        });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
} 