import { TestBed } from '@angular/core/testing';
import { PagerService } from './pager.service';


describe('PagerService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PagerService]
    });
  });

  it('can be created by dependency injection', () => {
    let pagerService = TestBed.get(PagerService);
    expect(pagerService instanceof PagerService).toBe(true);
  });

});
