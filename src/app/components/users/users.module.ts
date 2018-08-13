import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {UsersComponent} from './users.component';
import {UserComponent} from './user/user.component';
import {RegisterComponent} from './register/register.component';
import {UsersRoutingModule} from './users-routing.module';

@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [
    UsersComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    UsersComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
  ]
})
export class UsersModule { }
