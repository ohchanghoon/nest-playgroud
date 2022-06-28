import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from '../pipes/validation.pipe';

export class CreateUserDto {
  @Transform((params) => params.value.trim())
  @NotIn('password', {
    message: 'password는 namer와 같은 문자열을 포함할 수 없다.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  //   @Transform(({ value, obj }) => {
  //     if (obj.password.includes(value.trim())) {
  //       throw new BadRequestException(
  //         'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //       );
  //     }
  //     return value.trim();
  //   })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/, { message: '양식을 맞춰' })
  readonly password: string;
}
