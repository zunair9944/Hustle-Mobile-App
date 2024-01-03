import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentSectionPage } from './comment-section.page';

describe('CommentSectionPage', () => {
  let component: CommentSectionPage;
  let fixture: ComponentFixture<CommentSectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommentSectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
