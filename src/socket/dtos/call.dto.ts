import { IsNumber, IsObject } from 'class-validator';

export class CallDto {
  @IsObject()
  from: {
    id: number;
    name: string;
    picture: string;
  };

  @IsNumber()
  toId: number;
}
