import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Beer } from 'src/app/models/beer.model';
import { SearchBeerService } from 'src/app/services/search-beer.service';

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

  constructor(private searchBeerService: SearchBeerService) {}

  ngOnInit(): void {
    for (let i = 0; i < this.maxStars; i++) {
      this.starArr.push(i);
    }
  }

  save(product: any) {}

  clear() {
    this.beer = {};
    this.searchString = '';
  }

  async search() {
    this.beer = await this.searchBeerService.searchBeer(this.searchString);
  }

  onClick(rating: number) {
    this.rating = rating;
    this.beer.rating = rating;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
