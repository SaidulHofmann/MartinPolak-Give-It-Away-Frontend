import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PermissionsComponent} from './permissions.component';
import {PermissionComponent} from './permission/permission.component';
import {PermissionsRoutingModule} from './permissions-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PermissionsRoutingModule
  ],
  declarations: [
    PermissionsComponent,
    PermissionComponent
  ],
  exports: [
    PermissionsComponent,
    PermissionComponent
  ],
  providers: [
  ]
})
export class PermissionsModule { }
