import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('before ----------------');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After--------- ${Date.now() - now}ms`)));
  }
}

export interface Response<T> {
  data: T;
}

export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return { data };
      }),
    );
  }
}
