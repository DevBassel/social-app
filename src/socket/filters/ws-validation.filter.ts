// ws-validation.filter.ts
import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  ExceptionFilter,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

@Catch(BadRequestException, UnauthorizedException, NotFoundException)
export class WsValidationFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const response = {
      event: 'error',
      data: exception.getResponse(),
    };

    client.emit(response.event, response.data);
  }
}
