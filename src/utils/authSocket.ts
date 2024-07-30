import { Socket } from 'socket.io';
import { JwtPayload } from 'src/modules/auth/dto/jwtPayload';

export interface AuthSocket extends Socket {
  user: JwtPayload;
}
