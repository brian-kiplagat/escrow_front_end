import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSellComponent } from './navbar-sell.component';

describe('NavbarSellComponent', () => {
  let component: NavbarSellComponent;
  let fixture: ComponentFixture<NavbarSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarSellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
