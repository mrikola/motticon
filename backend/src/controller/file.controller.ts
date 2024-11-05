import { Container } from '../container';
import { Request, Response } from 'express';
import path from 'path';
import { FileService } from '../service/file.service';

export class FileController {
  private fileService: FileService;

  constructor() {
    this.fileService = Container.get('FileService');
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