import { TestBed, inject } from '@angular/core/testing';

import { DialogService } from './dialog.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {MatDialog} from '@angular/material';
import {DataService} from './data.service';
import {AuthService} from '../../permission/services/auth.service';
import {NavigationService} from './navigation.service';
import {HttpClient} from '../../../../../node_modules/@angular/common/http';
import {SharedModule} from '../shared.module';

describe('DialogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      providers: [DialogService, MatDialog]
    });
  });

  it('can be created by dependency injection', inject([DialogService], (service: DialogService) => {
    let dialogService = new DialogService(TestBed.get(MatDialog));
    expect(dialogService).toBeTruthy();
  }));
});
