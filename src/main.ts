import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        styletSrc:  ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", "data:", "https"],
        // fontSrc:    ["'self'"],
        // connectSrc: ["'self'"],
        // objectSrc:  ["'none'"],
        // mediaSrc:   ["'none'"],
        // frameSrc:   ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));
  app.enableCors({
    // origin: process.env.CORS_ORIGN || '*',
    origin: (origin, callback) => {
      if(!origin) return callback(null, true);
      const allowOrigins = process.env.CORS_ORIGN?.split(',') || ['*'];
      if(allowOrigins.includes('*') || allowOrigins.includes(origin)){
        return callback(null, true);
      }else{
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: [
      'Content-Type', 
      'Authorizarion',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    maxAge: 86400 // 24h
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  const config = new DocumentBuilder()
    .setTitle('Mkt api gateway')
    .setDescription('Gtw for MS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api', app, document); 
  const port = process.env.PORT || 3005;
  await app.listen(port);
  console.log('API Gateway running on port ', port);
  console.log('Swagger <http://localhost>:' + port + '/api');
}
bootstrap();
