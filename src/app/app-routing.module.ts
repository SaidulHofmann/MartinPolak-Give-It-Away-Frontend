import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {PermissionsComponent} from './components/permissions/permissions.component';

// Routes to top-level-components without own routing module.
const routes: Routes = [
];

// Default routes added at the end of the list.
export const defaultRoutes: Routes = [
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
