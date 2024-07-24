import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { JwtPayload } from './dto/jwtPayload';
import { ProviderType } from '../user/enums/ProviderType.enum';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client({
    clientId: this.config.getOrThrow('client_Id'),
    clientSecret: this.config.getOrThrow('clientSecret'),
    redirectUri: this.config.getOrThrow('callbackURL'),
  });
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async googleLogin() {
    const url = this.googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    });
    return url;
  }

  async GoogleCallBack(code: string, res: Response) {
    const { tokens } = await this.googleClient.getToken(code);
    const { email, sub, name, picture } = (
      await this.googleClient.verifyIdToken({
        idToken: tokens.id_token,
      })
    ).getPayload();

    const checkUser = await this.userRepo.findOneBy({
      email,
    });

    const user =
      checkUser ??
      (await this.userRepo.save({
        email,
        provider: ProviderType.GOOGLE,
        name,
        picture,
        providerId: sub,
      }));

    const token = this.createToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    if (!user) throw new ConflictException();
    return res.redirect(
      `${this.config.getOrThrow('WEB_CLIENT_HOST')}/auth/google?token=${
        token.access_token
      }`,
    );
  }

  createToken(payload: JwtPayload) {
    return {
      access_token: this.jwt.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }
}
