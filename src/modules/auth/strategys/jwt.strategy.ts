import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../dto/jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_KEY'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepo.findOneBy({
      id: payload.id,
    });
    console.log(payload);
    if (user) return payload;

    throw new UnauthorizedException();
  }
}
