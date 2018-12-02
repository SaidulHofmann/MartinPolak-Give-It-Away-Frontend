import { TestBed } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {Location} from '@angular/common';

describe('NavigationService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [NavigationService, Location]
    });
  });

  it('can be created by dependency injection', () => {
    let navigationService = TestBed.get(NavigationService);
    expect(navigationService instanceof NavigationService).toBe(true);
  });

});
