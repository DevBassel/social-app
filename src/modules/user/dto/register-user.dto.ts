import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(2, 10)
  first_name: string;

  @IsString()
  @Length(2, 10)
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 16)
  password: string;
}
