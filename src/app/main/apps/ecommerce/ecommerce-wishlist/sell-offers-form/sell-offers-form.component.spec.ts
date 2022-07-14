import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellOffersFormComponent } from './sell-offers-form.component';

describe('SellOffersFormComponent', () => {
  let component: SellOffersFormComponent;
  let fixture: ComponentFixture<SellOffersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellOffersFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellOffersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
