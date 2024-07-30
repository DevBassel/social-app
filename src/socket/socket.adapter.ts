import { INestApplication, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { JwtPayload } from 'src/modules/auth/dto/jwtPayload';
import { UserService } from 'src/modules/user/user.service';
import { AuthSocket } from 'src/utils/authSocket';

@Injectable()
export class WsAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplication,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, options);

    server.use(async (socket: AuthSocket, next) => {
      console.log('in io adapter');
      const token =
        socket.handshake.headers.authorization &&
        socket.handshake.headers.authorization.split(' ')[1];

      if (!token) return next(new Error('Not Authenticated.'));

      const verify: JwtPayload = this.jwt.verify(token);
      console.log(verify);

      const user = await this.userService.findOne({ id: verify.id });
      socket['user'] = verify;

      console.log('ws guard');
      if (user) return next();

      return next(new Error('Unauthorized.'));
    });
    return server;
  }
}
