import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { UserAuthPage } from './user-auth.page';

describe('UserAuthPage', () => {
  let component: UserAuthPage;
  let fixture: ComponentFixture<UserAuthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UserAuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
