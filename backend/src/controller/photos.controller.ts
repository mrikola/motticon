import path from 'path';
import { FileService } from '../service/file.service';
import { Get, Route, Controller, Request } from 'tsoa';
import { Service } from 'typedi';
import express from 'express';
import mime from 'mime-types';
import { createReadStream } from 'fs';
import { FILE_ROOT } from '../util/fs';

@Route("photos")
@Service()
export class PhotosController extends Controller {
  constructor(
    private fileService: FileService
  ) {
    super();
  }

  private streamFile(res: express.Response, filePath: string, mimeType: string): Promise<void> {
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', 'inline');
    
    return new Promise((resolve, reject) => {
      createReadStream(filePath)
        .pipe(res)
        .on('finish', resolve)
        .on('error', reject);
    });
  }

  @Get("*")
  public async servePhoto(
    @Request() request: express.Request,
  ): Promise<void> {
    const requestPath = request.path.replace(FILE_ROOT, "");
    try {
      const filePath = await this.fileService.getFilePath(requestPath);
      const mimeType = mime.contentType(path.extname(filePath)) || 'application/octet-stream';
      return this.streamFile(request.res, filePath, mimeType);
    } catch (error) {
      console.log(error);
      const fallbackFile = "README.md";
      const fallbackPath = path.join(__dirname, '..', '..', fallbackFile);
      return this.streamFile(request.res, fallbackPath, 'text/plain');
    }
  };
} 