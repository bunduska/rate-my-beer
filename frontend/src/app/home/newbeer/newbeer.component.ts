import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Beer } from '../../models/beer.model';
import { BeerService } from '../../services/beer.service';
import { SearchBeerService } from '../../services/search-beer.service';

@Component({
  selector: 'newbeer',
  templateUrl: './newbeer.component.html',
  styleUrls: ['./newbeer.component.css'],
})
export class NewbeerComponent implements OnInit {
  beer: Beer = {};

  searchString: string = '';

  rating: number = 0;
  maxStars: number = 10;
  starArr: number[] = [];

  messageFromBackend: string = '';

  constructor(
    private searchBeerService: SearchBeerService,
    private beerService: BeerService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    for (let i = 0; i < this.maxStars; i++) {
      this.starArr.push(i);
    }
  }

  async save() {
    if (
      this.beer.name === '' ||
      this.beer.rating === 0 ||
      this.beer.rating === undefined
    ) {
      this.openSnackBar('Name and ratings are mandatory!!!');
    } else {
      this.beerService.saveBeer(this.beer).subscribe((res: any) => {
        this.openSnackBar(res.message);
        this.clear();
        this.beerService.getBeerList().subscribe((beers) => {
          this.beerService.updateBeerList(beers as Beer[]);
        });
      });
    }
  }

  clear() {
    this.beer = {};
    this.searchString = '';
    this.rating = 0;
  }

  async search() {
    if (this.searchString === '') {
      this.openSnackBar('Enter a text to search!');
    } else {
      this.beer = {};
      this.rating = 0;
      this.beer = await this.searchBeerService.searchBeer(this.searchString);
    }
  }

  onClick(rating: number) {
    this.rating = rating;
    this.beer.rating = rating;
  }

  showIcon(index: number) {
    return `../../../assets/${this.rating >= index + 1 ? 'full' : 'empty'}.svg`;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 4000 });
  }
}
