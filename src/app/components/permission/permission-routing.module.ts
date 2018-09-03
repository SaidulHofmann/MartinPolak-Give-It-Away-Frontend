import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PermissionComponent} from './permission.component';
import {AuthGuard} from '../user/services/auth-guard.service';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';


const routes: Routes = [
  {
    path: 'permissions',
    component: PermissionComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PermissionRoutingModule { }
