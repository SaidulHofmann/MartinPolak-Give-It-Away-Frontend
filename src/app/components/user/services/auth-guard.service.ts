import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {UserService} from './user.service';
import {Observable} from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor( private userService: UserService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log(`@AuthGuard.CanActivate(): ${this.userService.isAuthenticated}.`);
    return this.userService.isAuthenticated;
  }
}
