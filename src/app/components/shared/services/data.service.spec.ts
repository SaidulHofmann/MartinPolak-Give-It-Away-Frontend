import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';
import {NavigationService} from './navigation.service';
import {HttpClient} from '../../../../../node_modules/@angular/common/http';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        DataService,
        { provide: AuthService, useClass: AuthServiceMock },
        NavigationService
      ]
    });
  });

  it('can be created by dependency injection', inject([DataService], (service: DataService) => {
    let dataService = new DataService(
      TestBed.get(AuthService),
      TestBed.get(NavigationService),
      TestBed.get(HttpClient)
    );
    expect(dataService).toBeTruthy();
  }));
});
