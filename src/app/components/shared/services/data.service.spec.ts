import { TestBed, inject } from '@angular/core/testing';
import { DataService } from './data.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from '../../permission/services/auth.service';
import {NavigationService} from './navigation.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


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

  it('can be created by dependency injection', () => {
    let dataService = TestBed.get(DataService);
    expect(dataService instanceof DataService).toBe(true);
  });
});
