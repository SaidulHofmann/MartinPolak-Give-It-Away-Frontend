import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleGiveawayComponent } from './article-giveaway.component';

describe('ArticleGiveawayComponent', () => {
  let component: ArticleGiveawayComponent;
  let fixture: ComponentFixture<ArticleGiveawayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleGiveawayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleGiveawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
