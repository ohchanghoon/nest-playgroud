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
  BadRequestException,
  HttpException,
  HttpStatus,
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
import { ClassRolesGuard } from './auth/classRoles.guard';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
// interface User {
//   name: string;
//   email: string;
// }
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
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (+id < 1) {
      // throw new HttpException(
      //   {
      //     message: 'id는 0보다 큰 정수여야합니다.',
      //     foo: 'bar',
      //     statusCode: HttpStatus.BAD_REQUEST,
      //   },
      //   HttpStatus.BAD_REQUEST,
      // );
      throw new BadRequestException(
        'id는 0보다 큰 정수여야합니다.',
        'id format exception',
      );
    }
    return true;
    // return this.usersService.findOne(+id);
  }

  @Get('/with-pipe')
  getHello(
    @UserData(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ) {
    console.log(user);
  }
  // @Get()
  // getHello(@UserData('email') user: User) {
  //   console.log(user);
  // }

  // @UseGuards(AuthGuard)
  // @Get(':id')
  // async getUserInfo(@Headers() headers: any, @Param('id') userId: string) {
  //   return this.usersService.getUserInfo(userId);
  // }

  // @Post()
  // async createUser(@Body() dto: CreateUserDto): Promise<void> {
  //   const { name, email, password } = dto;
  //   await this.usersService.createUser(name, email, password);
  // }
  @Post()
  @Roles('admin')
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    this.printLoggerServiceLog(dto);
    await this.usersService.createUser(name, email, password);
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
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
