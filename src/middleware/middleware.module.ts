import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggingMiddleware } from './logging/logging.middleware';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 min
        limit: 100, //requests per minute
      }
    ])
  ],
  providers: [LoggingMiddleware],
  exports: [],
})
export class MiddlewareModule {}
