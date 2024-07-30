import { Catch, ArgumentsHost, WsExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionsFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    const response = {
      event: 'error',
      data: {
        status: 'error',
        message: exception.message,
      },
    };

    client.emit(response.event, response.data);
  }
}
