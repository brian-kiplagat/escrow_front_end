import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLargeScreenComponent } from './navbar-large-screen.component';

describe('NavbarSellComponent', () => {
  let component: NavbarLargeScreenComponent;
  let fixture: ComponentFixture<NavbarLargeScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarLargeScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarLargeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
