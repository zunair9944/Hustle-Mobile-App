import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParentConfirmationPage } from './parent-confirmation.page';

describe('ParentConfirmationPage', () => {
  let component: ParentConfirmationPage;
  let fixture: ComponentFixture<ParentConfirmationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ParentConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
