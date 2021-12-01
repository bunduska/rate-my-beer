import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Beer } from 'src/app/models/beer.model';
import { BeerService } from 'src/app/services/beer.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BeerModalComponent } from './beermodal.component';

@Component({
  selector: 'beerlist',
  templateUrl: './beerlist.component.html',
  styleUrls: ['./beerlist.component.css'],
})
export class BeerlistComponent implements OnInit {
  beers: Beer[] = [];
  displayedColumns: string[] = [
    'name',
    'type',
    'abv',
    'brewery',
    'country',
    'rating',
    'date',
  ];
  dataSource!: MatTableDataSource<Beer>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private beerService: BeerService,
    private _liveAnnouncer: LiveAnnouncer,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.beerService.getBeerList().subscribe((beers) => {
      this.updateBeers(beers as Beer[]);
    });
    this.beerService.currentBeerList.subscribe((beers) => {
      this.updateBeers(beers);
    });
  }

  updateBeers(beers: Beer[]) {
    this.beers = beers;
    this.dataSource = new MatTableDataSource(this.beers);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openModal(beer: Beer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    this.matDialog.open(BeerModalComponent, dialogConfig);
    this.beerService.setCurrentBeer(beer);
  }

}
