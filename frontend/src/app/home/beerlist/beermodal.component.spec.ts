import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeerModalComponent } from './beermodal.component';

xdescribe('BeerModalComponent', () => {
  let component: BeerModalComponent;
  let fixture: ComponentFixture<BeerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BeerModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
