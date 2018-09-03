import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {PermissionComponent} from './components/permission/permission.component';

// Routes to top-level-components without own routing module.
const routes: Routes = [];

// Default routes added at the end of the list.
export const defaultRoutes: Routes = [
  { path: '', redirectTo: '/users/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
