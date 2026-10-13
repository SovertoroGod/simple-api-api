import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip properties with no decorator
      forbidNonWhitelisted: true, // ...and 400 if the client sent them
      transform: true,             // convert the body into DTO class instances
    })
  )

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
