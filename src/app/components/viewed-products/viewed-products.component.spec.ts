import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewedProductsComponent } from './viewed-products.component';

describe('ViewedProductsComponent', () => {
  let component: ViewedProductsComponent;
  let fixture: ComponentFixture<ViewedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewedProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
