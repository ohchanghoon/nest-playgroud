import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SECRET_KEY } from 'src/const';

interface User {
  id: string;
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async login(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, SECRET_KEY, {
      expiresIn: '1d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  async verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, SECRET_KEY) as (
        | jwt.JwtPayload
        | string
      ) &
        User;
      const { id, email } = payload;

      return {
        userId: id,
        email,
      };
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
