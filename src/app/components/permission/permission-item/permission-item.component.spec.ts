import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionItemComponent } from './permission-item.component';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from '../services/auth.service';
import {PermissionItemService} from '../services/permission-item.service';
import {DialogService} from '../../shared/services/dialog.service';
import {SharedModule} from '../../shared/shared.module';

describe('PermissionItemComponent', () => {
  let component: PermissionItemComponent;
  let fixture: ComponentFixture<PermissionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [PermissionItemComponent],
      providers: [ AuthService, PermissionItemService, DialogService ]
    });
    this.fixture = TestBed.createComponent(PermissionItemComponent);
    this.component = this.fixture.componentInstance;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('can be created by dependency injection', () => {
    expect(component).toBeTruthy();
  });
});
