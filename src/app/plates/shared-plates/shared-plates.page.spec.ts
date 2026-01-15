import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedPlatesPage } from './shared-plates.page';

describe('SharedPlatesPage', () => {
  let component: SharedPlatesPage;
  let fixture: ComponentFixture<SharedPlatesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SharedPlatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
