import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from './users.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';


const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'users/register', component: RegisterComponent },
  { path: 'users/login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UsersRoutingModule { }
