import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
/*
    canActivate함수는 ExecutionContext인스턴스를 인자로 받습니다.
    ExecutionContext는 ArgumentHost를 상속받는데, 요청과 응답에 대한 정보를 가지고 있다.
    http로 기능을 제공하고 있으므로 인터페이스에서 제공하는 함수 중 switchToHttp()함수를 사용하여 필요한 정보를 가져올 수 있다.
*/

@Injectable()
export class UsersAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: any) {
    return true;
  }
}
