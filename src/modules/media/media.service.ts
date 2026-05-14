import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudService: CloudinaryService,
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
  ) {}
  async create(file: Express.Multer.File) {
    const { public_id, format, url, width, height } =
      await this.cloudService.uploadFile(file, {
        folder: 'social/media',
        resource_type: 'auto',
        transformation: { quality: 80 },
      });
    // console.log(other);

    return this.mediaRepo.save({
      cloudId: public_id,
      format,
      url,
      width,
      height,
    });
  }
  async delete(id: number) {
    const media = await this.mediaRepo.findOneBy({ id });
    if (!media) throw new NotFoundException('media not found');

    await this.cloudService.deleteFile(media.cloudId);
    return this.mediaRepo.delete({ id });
  }
}
