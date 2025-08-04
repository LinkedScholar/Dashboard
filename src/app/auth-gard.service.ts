import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { NbAuthService } from '@nebular/auth';
import { first, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsService {

    constructor(private router: Router, private authService: NbAuthService) {}

    canActivate(): Observable<boolean> {
        return this.authService.isAuthenticated().pipe(
            map(authenticated => {
              if (!authenticated) {
                this.router.navigate(['auth/login']);
                return false;
              }
              return true;
            }),
            first(),
          );
    }
}

export const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate();
};