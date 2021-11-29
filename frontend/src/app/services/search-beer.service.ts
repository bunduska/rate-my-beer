import { Injectable } from '@angular/core';
import { Beer } from '../models/beer.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchBeerService {
  constructor(private http: HttpClient) {}

  async searchBeer(search: string): Promise<Beer> {
    const unTappdSearchString: string = `https://api.untappd.com/v4/search/beer?q=${search}&client_id=${environment.UNTAPPED_CLIENT_ID}&client_secret=${environment.UNTAPPED_CLIENT_SECRET}`;
    let response: string;
    let beerFound: Beer = new Beer();

    this.http.get(unTappdSearchString).subscribe((data: Object) => {
      response = JSON.stringify(data);
      beerFound.name = this.findMyValues(response, 'beer_name');
      beerFound.abv = this.findMyValues(response, 'beer_abv', true);
      beerFound.brewery = this.findMyValues(response, 'brewery_name');
      beerFound.country = this.findMyValues(response, 'country_name');
      beerFound.type = this.findMyValues(response, 'beer_style');
      beerFound.imageUrl = this.findMyValues(response, 'beer_label');
      beerFound.comment = this.findMyValues(response, 'beer_description');
      beerFound.city = this.findMyValues(response, 'brewery_city');
    });
    return beerFound;
  }

  findMyValues(text: string, search: string, isNumber?: boolean): string {
    try {
      if (isNumber) {
        return text.split(search)[1].split(',')[0].split('"')[1].replace(':','');
      }
      return text.split(search)[1].split(',')[0].split('"')[2];
    } catch {
      return '';
    }
  }
}
