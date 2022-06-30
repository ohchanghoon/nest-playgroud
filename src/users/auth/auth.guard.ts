// import { Request } from 'express';
// import { Observable } from 'rxjs';
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { AuthService } from 'src/auth/auth.service';

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     return this.validateRequest(request);
//   }

//   private async validateRequest(request: Request) {
//     const jwtString = request.headers.authorization.split('Bearer ')[1];
//     const user = await this.authService.verify(jwtString);

//     if (user) return true;
//     false;
//   }
// }
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ) /*: boolean | Promise<boolean> | Observable<boolean> */ {
    const request = context.switchToHttp().getRequest();

    request.user = {
      name: 1,
      email: 'dhckdgns3@naver.com',
    };
    return true;
    // return this.validateRequest(request);
  }

  // private async validateRequest(request: Request) {
  //   const jwtString = request.headers.authorization.split('Bearer ')[1];
  //   const user = await this.authService.verify(jwtString);

  //   if (user) return true;
  //   false;
  // }
}
