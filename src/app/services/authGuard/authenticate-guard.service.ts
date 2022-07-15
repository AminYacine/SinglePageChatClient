import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad, Route, Router,
  RouterStateSnapshot, UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from "../authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authenticate();
  }


  private authenticate(): boolean {
    if (!this.authService.isUserLoggedIn()) {

      this.router.navigateByUrl("/login");
      return false;
    } else {
      return true;
    }
  }
}
