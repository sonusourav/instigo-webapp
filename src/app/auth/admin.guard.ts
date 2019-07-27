import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';
import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
 
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
  // decode the token to get its payload
   const token = localStorage.getItem('token');
  const tokenPayload = decode(token)
  console.log(tokenPayload);
    if (
      !tokenPayload.isAdmin
    ) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}