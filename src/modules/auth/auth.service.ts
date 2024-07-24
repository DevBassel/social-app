import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { Response } from 'express';
import { JwtPayload } from './dto/jwtPayload';
import { ProviderType } from '../user/enums/ProviderType.enum';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  createToken(payload: JwtPayload) {
    return {
      access_token: this.jwt.sign(payload, {
        expiresIn: '7d',
      }),
    };
  }

  // ---------------- Google auth ---------------------------
  private googleClient = new OAuth2Client({
    clientId: this.config.getOrThrow('client_Id'),
    clientSecret: this.config.getOrThrow('clientSecret'),
    redirectUri: this.config.getOrThrow('callbackURL'),
  });

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
    try {
      const { tokens } = await this.googleClient.getToken(code);
      const { email, sub, name, picture } = (
        await this.googleClient.verifyIdToken({
          idToken: tokens.id_token,
        })
      ).getPayload();

      const checkUser = await this.userService.findOne({ email });

      const user =
        checkUser ??
        (await this.userService.createGoogle({
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
        role: user.role,
      });

      if (!user) throw new ConflictException();
      return res.redirect(
        `${this.config.getOrThrow('WEB_CLIENT_HOST')}/auth/google?token=${
          token.access_token
        }`,
      );
    } catch (error) {
      console.log(error);
      throw new ConflictException(error.message);
    }
  }

  // -------------- Email and Password -------------------
  async createUserWithEmailAndPassword(data: RegisterUserDto) {
    const checkUser = await this.userService.findOne({ email: data.email });

    if (checkUser) throw new ConflictException('user already exist O_o');

    const hashPassword = await hash(data.password, await genSalt());

    await this.userService.createUser({ ...data, password: hashPassword });

    return { msg: 'user is created ^_^' };
  }

  async loginUserWithEmailAndPassword(data: LoginUserDto) {
    const user = await this.userService.findOne({ email: data.email });

    if (!user) throw new UnauthorizedException('email or passwor is wrong O_o');

    const verifyPassword = await compare(data.password, user.password);

    if (!verifyPassword)
      throw new UnauthorizedException('email or passwor is wrong O_o');

    return this.createToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }
}
