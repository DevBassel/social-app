import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';

@Controller('media')
export class MedaiController {
  constructor(private readonly meadiService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  async create(@UploadedFile() file: Express.Multer.File) {
    return this.meadiService.create(file);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.meadiService.delete(id);
  }
}
