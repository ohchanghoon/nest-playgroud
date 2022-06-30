import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { LoggingInterceptor, TransformInterceptor } from './interceptor';
import { AuthGuard } from './users/auth/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // app.useGlobalGuards(new UsersAuthGuard());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );
  await app.listen(3000);
}
bootstrap();
