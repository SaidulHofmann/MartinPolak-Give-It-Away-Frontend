import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {Observable} from 'rxjs/internal/Observable';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthService,
               private navService: NavigationService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated) {
      return true;
    } else {
      this.navService.gotoLoginPage();
      return false;
    }
  }
}
