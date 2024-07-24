import { PartialType } from '@nestjs/swagger';
import { CreateMeadiDto } from './create-meadi.dto';

export class UpdateMeadiDto extends PartialType(CreateMeadiDto) {}
