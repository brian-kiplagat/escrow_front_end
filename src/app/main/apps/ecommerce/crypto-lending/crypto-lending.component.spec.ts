import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoLendingComponent } from './crypto-lending.component';

describe('CryptoLendingComponent', () => {
  let component: CryptoLendingComponent;
  let fixture: ComponentFixture<CryptoLendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoLendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoLendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
