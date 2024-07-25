import { Global, Module } from '@nestjs/common';
import { MediaService } from './media.service';
// import { MedaiController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Media]), CloudinaryModule],
  // controllers: [MedaiController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MeadiModule {}
