import { TestBed, inject } from '@angular/core/testing';
import { DialogService } from './dialog.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {MatDialog} from '@angular/material';
import {SharedModule} from '../shared.module';


describe('DialogService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      providers: [DialogService, MatDialog]
    });
  });

  it('can be created by dependency injection', inject([DialogService], (service: DialogService) => {
    let dialogService = TestBed.get(DialogService);
    expect(dialogService instanceof DialogService).toBe(true);
  }));
});
