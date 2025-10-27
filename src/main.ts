import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { TransformDateInterceptor } from './common/interceptors/shamsi-date.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Cors config
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new TransformDateInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Personal Accounting API')
    .setDescription('API documentation for the personal accounting system')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth() // Optional: Add JWT authentication
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger UI available at /api/docs
  await app.listen(process.env.PORT ?? 4002);
}
bootstrap();
