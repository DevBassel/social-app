import { Request } from 'express';
import { JwtPayload } from 'src/modules/auth/dto/jwtPayload';

export interface AuthRequest extends Request {
  user: JwtPayload;
}
