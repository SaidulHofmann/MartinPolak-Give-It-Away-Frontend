import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {PermissionComponent} from './permission.component';
import {PermissionItemComponent} from './permission-item/permission-item.component';
import {PermissionRoutingModule} from './permission-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PermissionRoutingModule
  ],
  declarations: [
    PermissionComponent,
    PermissionItemComponent
  ],
  exports: [
    PermissionComponent,
    PermissionItemComponent
  ],
  providers: [
  ]
})
export class PermissionModule { }
