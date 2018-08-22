import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';
import {defaultRoutes} from './app-routing.module';

import { SharedModule } from './components/shared/shared.module';
import { PermissionsModule } from './components/permissions/permissions.module';
import { UsersModule } from './components/users/users.module';
import { ArticlesModule } from './components/articles/articles.module';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DateValueAccessorDirective } from './directives/dateValueAccessor.directive';

import { ErrorHandlerService } from './components/shared/services/error-handler.service';
import { MatPaginatorIntl } from '@angular/material';
import { MatPaginatorIntlDe } from './core/types.core';
import { DialogComponent } from './components/shared/dialog/dialog.component';

@NgModule({
  imports: [
    SharedModule,
    PermissionsModule,
    UsersModule,
    ArticlesModule,
    RouterModule.forChild(defaultRoutes)
  ],
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DateValueAccessorDirective
  ],
  providers: [
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlDe }
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
