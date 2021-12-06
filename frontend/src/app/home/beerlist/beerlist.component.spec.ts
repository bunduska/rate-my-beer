import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeerlistComponent } from './beerlist.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Beer } from 'src/app/models/beer.model';
import { BeerService } from 'src/app/services/beer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BeerModalComponent } from './beermodal.component';

describe('BeerlistComponent', () => {
  let component: BeerlistComponent;
  let fixture: ComponentFixture<BeerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeerService],
      declarations: [BeerlistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture).toMatchSnapshot();
  });
});
