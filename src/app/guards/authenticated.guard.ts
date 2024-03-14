import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FireAuthService } from '@services/fireauth.service';
import { map } from 'rxjs';

export const authenticatedGuard: CanActivateFn = () => {
  const fireAuth = inject(FireAuthService);
  const router = inject(Router);
  return fireAuth.currentUser$.pipe(
    map(user => {
      if (user !== null) {
        return true;
      } else {
        router.navigate(['/sign']);
        return false;
      }
    })
  );
};
