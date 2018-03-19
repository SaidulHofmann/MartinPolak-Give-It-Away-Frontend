import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Test1DetailComponent } from './test1-detail.component';

describe('Test1DetailComponent', () => {
  let component: Test1DetailComponent;
  let fixture: ComponentFixture<Test1DetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Test1DetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Test1DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
