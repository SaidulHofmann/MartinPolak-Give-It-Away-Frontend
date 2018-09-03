import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserComponent} from './user.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './services/auth-guard.service';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';


const routes: Routes = [
  { path: 'users', component: UserComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'users/register', component: RegisterComponent },
  { path: 'users/login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UserRoutingModule { }
