import { TestBed, inject } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {DataService} from './data.service';
import {AuthService} from '../../permission/services/auth.service';
import {HttpClient} from '../../../../../node_modules/@angular/common/http';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

describe('NavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [NavigationService, Location]
    });
  });

  it('can be created by dependency injection', inject([NavigationService], (service: NavigationService) => {
    let navigationService = new NavigationService(TestBed.get(Router), TestBed.get(Location));
    expect(navigationService).toBeTruthy();
  }));
});
