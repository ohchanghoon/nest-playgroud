import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersAuthModule } from './users/users-auth/users-auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, UsersAuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
