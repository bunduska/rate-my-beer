import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbeerComponent } from './newbeer.component';

describe('NewbeerComponent', () => {
  let component: NewbeerComponent;
  let fixture: ComponentFixture<NewbeerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewbeerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewbeerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
