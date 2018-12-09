import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {CanDeactivateGuard} from './can-deactivate-guard.service';
import {ComponentMock} from '../../../../testing/mocks.test';


describe('CanDeactivateGuard', () => {
  let canDeactivateGuard: CanDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [CanDeactivateGuard]
    });
    this.canDeactivateGuard = TestBed.get(CanDeactivateGuard);
  });

  it('can be created by dependency injection', () => {
    expect(this.canDeactivateGuard instanceof CanDeactivateGuard).toBe(true);
  });

  it('should deactivate if component deactivable', () => {
    let component = new ComponentMock();
    component.isDeactivable = true;
    expect(this.canDeactivateGuard.canDeactivate(component)).toBe(true);
  });

  it('should not deactivate if component not deactivable', () => {
    let component = new ComponentMock();
    component.isDeactivable = false;
    expect(this.canDeactivateGuard.canDeactivate(component)).toBe(false);
  });

});
