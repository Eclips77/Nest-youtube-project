import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RollbackManager } from '../managers/rollback.manager';

@Injectable()
export class RollbackInterceptor implements NestInterceptor {
  constructor(private readonly rollbackManager: RollbackManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(async (err) => {
        // If an error occurs anywhere in the request handling (controller/service),
        // execute any registered rollback tasks.
        await this.rollbackManager.executeRollback();

        // Return the error to the client (or transform it)
        return throwError(() => err);
      }),
    );
  }
}
