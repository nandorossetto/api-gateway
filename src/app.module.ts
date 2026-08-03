import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 min
      limit: 100 // rate limit
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
