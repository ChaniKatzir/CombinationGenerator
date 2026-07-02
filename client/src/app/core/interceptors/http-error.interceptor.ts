import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ClientHttpError {
  status: number;
  message: string;
}

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const clientError: ClientHttpError = {
        status: error.status,
        message:
          error.error?.message ||
          error.error?.title ||
          error.message ||
          'Something went wrong. Please try again.',
      };

      return throwError(() => clientError);
    }),
  );
};