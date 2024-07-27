import { PartialType } from '@nestjs/swagger';
import { CreateMsgDto } from './create-msg.dto';

export class UpdateMsgDto extends PartialType(CreateMsgDto) {}
