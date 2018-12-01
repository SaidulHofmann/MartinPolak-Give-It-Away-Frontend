import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemComponent } from './user-item.component';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';
import {UserItemService} from '../services/user-item.service';
import {DialogService} from '../../shared/services/dialog.service';
import {SharedModule} from '../../shared/shared.module';

describe('UserItemComponent', () => {
  let component: UserItemComponent;
  let fixture: ComponentFixture<UserItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [ UserItemComponent ],
      providers: [
        {provide: AuthService, useClass: AuthServiceMock},
        UserItemService,
        DialogService
      ]
    });

    fixture = TestBed.createComponent(UserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can be created by dependency injection', () => {
    expect(component).toBeTruthy();
  });
});
