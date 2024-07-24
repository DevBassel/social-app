import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  @ApiProperty({
    example: 'access token you will get it from google OAuth client',
  })
  access_token: string;
}
