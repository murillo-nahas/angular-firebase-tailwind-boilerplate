import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  return authenticationService.isAuthenticatedUser().pipe(
    map((user: any) => {
      if (user) {
        return true;
      }

      router.navigate(['/login']);

      return false;
    })
  );
};
