import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {PermissionItemService} from './permission-item.service';
import {PermissionBackendService} from './permission-backend.service';


describe('PermissionItemService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PermissionItemService, PermissionBackendService]
    });
  });

  it('can be created by dependency injection', () => {
    let permissionItemService = TestBed.get(PermissionItemService);
    expect(permissionItemService instanceof PermissionItemService).toBe(true);
  });

});
