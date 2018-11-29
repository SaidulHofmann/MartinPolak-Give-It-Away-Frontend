import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './components/shared/shared.module';
import { PermissionModule } from './components/permission/permission.module';
import { UserModule } from './components/user/user.module';
import { ArticleModule } from './components/article/article.module';

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
    PermissionModule,
    UserModule,
    ArticleModule,
    AppRoutingModule
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
