import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { map } from 'rxjs/operators';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(NbAuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(authenticated => {
      if (!authenticated) {
        router.navigate(['auth/login']);
        return false;
      }

      return true;
    }),
  );
};