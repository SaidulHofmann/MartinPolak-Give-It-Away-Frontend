import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {LoginComponent} from './login/login.component';
import {UserComponent} from './user.component';
import {UserItemComponent} from './user-item/user-item.component';
import {RegisterComponent} from './register/register.component';
import {UserRoutingModule} from './user-routing.module';

@NgModule({
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  declarations: [
    UserComponent,
    UserItemComponent,
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    UserComponent,
    UserItemComponent,
    LoginComponent,
    RegisterComponent
  ],
  providers: [
  ]
})
export class UserModule { }
