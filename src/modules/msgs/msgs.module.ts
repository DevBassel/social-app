import { Module } from '@nestjs/common';
import { MsgsService } from './msgs.service';
import { MsgsController } from './msgs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Msg } from './entities/msg.entity';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Msg]), ChatModule],
  controllers: [MsgsController],
  providers: [MsgsService],
})
export class MsgsModule {}
