import { Service } from 'typedi';
import { existsSync } from 'fs';
import path from 'path';
import { FILE_ROOT } from '../util/fs';
import { AppError } from '../types/errors';

@Service()
export class FileService {
    public async getFilePath(requestPath: string): Promise<string> {
        if (existsSync(FILE_ROOT)) {
            const filePath = path.join(FILE_ROOT, requestPath);
            if (existsSync(filePath)) {
                return filePath;
            }
        }
        throw new AppError(404, 'File not found');
    }
} 