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
  ValidationPipe,
  LoggerService,
  Inject,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { AuthGuard } from './auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { UserData } from './users.decorate';
import { IsString } from 'class-validator';
import { Roles } from './auth/roles.decorator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { CreateUserCommand } from './command/create-user.command';
import { CommandBus } from '@nestjs/cqrs';
class UserEntity {
  @IsString()
  name: string;

  @IsString()
  email: string;
}
@Roles('user')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly usersService: UsersService,
    private authService: AuthService,
    private commandBus: CommandBus,
  ) {}

  @Get('/with-pipe')
  getHello(
    @UserData(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ) {
    console.log(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: string) {
    return this.usersService.getUserInfo(userId);
  }

  @Post()
  @Roles('admin')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    const command = new CreateUserCommand(name, email, password);
    return this.commandBus.execute(command);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (err) {
      this.logger.error('error : ' + JSON.stringify(dto), err.stack);
    }
    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Req() req) {
    console.log('req', req);

    return await this.usersService.login(req.body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
