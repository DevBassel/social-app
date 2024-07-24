import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    opts: UploadApiOptions,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(opts, (err, result) => {
        if (err) return reject(err);

        return resolve(result);
      });

      console.log({ uploadStream });
      const readStream = new Readable();

      readStream.push(file.buffer);

      readStream.push(null); // end

      readStream.pipe(uploadStream);
    });
  }
  async deleteFile(id: string) {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(id, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  }
}
