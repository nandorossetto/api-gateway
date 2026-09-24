import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Http');
  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const timeStamp = Date.now();
    this.logger.log(
      'Incoming Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}',
    );
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('Content-Length');
      const duration = Date.now() - timeStamp;
      this.logger.log(
        `Outgoing Response: ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0}b - ${duration}ms`,
      );
      if(statusCode >= 400){
        this.logger.error(
          `Error Response: ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0}b - ${duration}ms`,
        );
      }
    });
    res.on('error', (error) => {
      this.logger.error(
        `Error Response: ${method} ${originalUrl}  - ${error.message}`,
      );
    });
    res.on('timeout', () => {
      this.logger.warn(
        `Rquest Timeout: ${method} ${originalUrl}  - ${Date.now()}`,
      );
    });
    next();
  }
}
