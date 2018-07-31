import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NetloggerService} from './netlogger.service';

@Injectable()
export class ProtectedGuard implements CanActivate {
  constructor(private netloggerService: NetloggerService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.netloggerService.isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
    // return this.lumaraService.getIsAuthenticated().first();
  }
}
