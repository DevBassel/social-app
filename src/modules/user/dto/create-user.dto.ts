import { IsEmail, IsString } from 'class-validator';
import { ProviderType } from '../enums/ProviderType.enum';

export class CreateUserWithGoogleDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  provider: ProviderType.GOOGLE;

  @IsString()
  picture: string;

  @IsString()
  providerId: string;
}
