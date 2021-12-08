import { BeerService } from './../services/beer.service';
import { AuthService } from '../services/auth.service';
import { UsersComponent } from './../admin/users/users.component';
import { NewbeerComponent } from './newbeer/newbeer.component';
import { BeerlistComponent } from './beerlist/beerlist.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeComponent } from './home.component';
import { MatTabsModule } from '@angular/material/tabs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let beerServiceMock: BeerService;

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
        MatMenuModule,
        MatToolbarModule,
        MatTabsModule,
      ],
      declarations: [
        HomeComponent,
        BeerlistComponent,
        NewbeerComponent,
        UsersComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    const spy = jest.spyOn(component, 'isCurrentUserAdmin');
    spy.mockReturnValue(false);
    const spyBeerService = jest.spyOn(beerServiceMock, 'constructor');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
