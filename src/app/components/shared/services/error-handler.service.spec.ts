import { TestBed, inject } from '@angular/core/testing';
import { ErrorHandlerService } from './error-handler.service';


describe('ErrorHandlerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlerService]
    });
  });

  it('can be created by dependency injection', () => {
    let errorHandlerService = TestBed.get(ErrorHandlerService);
    expect(errorHandlerService instanceof ErrorHandlerService).toBe(true);
  });
});
