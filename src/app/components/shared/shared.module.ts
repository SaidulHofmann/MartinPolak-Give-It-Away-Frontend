import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './header/header.component';
import {MessagesComponent} from './messages/messages.component';
import {AppNavbarComponent} from './app-navbar/app-navbar.component';
import {PagerComponent} from './pager/pager.component';
import {FooterComponent} from './footer/footer.component';
import {DialogComponent} from './dialog/dialog.component';
import {AppRoutingModule} from '../../app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../material.module';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule
  ],
  declarations: [
    AppNavbarComponent,
    DialogComponent,
    FooterComponent,
    HeaderComponent,
    MessagesComponent,
    PagerComponent
  ],
  exports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,

    AppNavbarComponent,
    DialogComponent,
    FooterComponent,
    HeaderComponent,
    MessagesComponent,
    PagerComponent
  ]
})
export class SharedModule { }
