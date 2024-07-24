import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private loggerStream: fs.WriteStream | undefined;

  constructor() {
    if (process.env.NODE_ENV === 'dev') {
      const logsPath = './logs';

      this.loggerStream = fs.createWriteStream(`${logsPath}/access.log`, {
        flags: 'a',
      });
    }
  }

  use(req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV === 'dev' && this.loggerStream) {
      morgan('combined', {
        stream: {
          write: (message: string) => {
            this.loggerStream!.write(message);
            Logger.debug(message); // Log to console
          },
        },
      })(req, res, next);
    } else {
      morgan('combined')(req, res, next);
    }
  }
}
