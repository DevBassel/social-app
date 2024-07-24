import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MedaiController } from './media.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MedaiController],
  providers: [MediaService],
})
export class MeadiModule {}
