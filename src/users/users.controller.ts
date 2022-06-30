import {
  Controller,
  Post,
  Body,
  Query,
  Get,
  Headers,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserData } from './users.decorate';
interface User {
  name: string;
  email: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(@UserData('email') user: User) {
    console.log(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string) {
    return this.usersService.getUserInfo(userId);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
