import { Observable, of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeerlistComponent } from './beerlist.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Beer } from '../../models/beer.model';
import { BeerService } from '../../services/beer.service';
import { MatDialogModule } from '@angular/material/dialog';
import { BeerModalComponent } from './beermodal.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

class BeerServiceStub {
  getBeerList(): Observable<Beer[]> {
    const beerlist: Beer[] = [];
    return of(beerlist);
  }
}

xdescribe('BeerlistComponent', () => {
  let component: BeerlistComponent;
  let fixture: ComponentFixture<BeerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        OverlayModule,
        MatInputModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientModule,
        MatPaginatorModule,
        MatDialogModule,
      ],
      declarations: [BeerlistComponent],
      providers: [{ provide: BeerService, useClass: BeerServiceStub }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should match with previous snapshot', () => {
  //   expect(fixture).toMatchSnapshot();
  // });
});
