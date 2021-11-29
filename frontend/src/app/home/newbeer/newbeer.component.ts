import { Component, OnInit } from '@angular/core';
import { Beer } from 'src/app/models/beer.model';
import { SearchBeerService } from 'src/app/services/search-beer.service';

@Component({
  selector: 'newbeer',
  templateUrl: './newbeer.component.html',
  styleUrls: ['./newbeer.component.css'],
})
export class NewbeerComponent implements OnInit {
  searchString: string = '';
  beer: Beer = {};
  categories: any = {};

  constructor(private searchBeerService: SearchBeerService) {}

  ngOnInit(): void {}

  save(product: any) {}

  clear() {
    this.beer = {};
    this.searchString = '';
  }

  async search() {
    this.beer = await this.searchBeerService.searchBeer(this.searchString);
  }
}
