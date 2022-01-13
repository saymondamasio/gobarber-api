import { Injectable } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { storageConfig } from 'src/config/storage';
import { StorageProvider } from '../models/StorageProvider';

@Injectable()
export default class DiskStorageProvider implements StorageProvider {
  public async saveFile(file: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(storageConfig.tmpFolder, file),
      path.resolve(storageConfig.uploadFolder, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(storageConfig.uploadFolder, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}