import { BeerService } from 'src/app/services/beer.service';
import { Component, OnInit } from '@angular/core';
import { Beer } from 'src/app/models/beer.model';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'beermodal',
  templateUrl: './beermodal.component.html',
  styleUrls: ['./beermodal.component.css'],
})
export class BeerModalComponent implements OnInit {
  currentBeer: Beer = {};
  beerForm!: FormGroup;

  constructor(
    private beerService: BeerService,
    public dialog: MatDialog,
    private fromBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.beerService.currentBeer.subscribe((beer) => {
      this.currentBeer = beer;
    });

    this.beerForm = this.fromBuilder.group({
      name: [
        this.currentBeer.name,
        [Validators.minLength(3), Validators.required],
      ],
      id: [this.currentBeer.id],
      type: [this.currentBeer.type],
      abv: [this.currentBeer.abv],
      brewery: [this.currentBeer.brewery],
      country: [this.currentBeer.country],
      city: [this.currentBeer.city],
      imageUrl: [this.currentBeer.imageUrl],
      comment: [this.currentBeer.comment],
      rating: [
        this.currentBeer.rating,
        [Validators.min(0), Validators.required],
      ],
      date: [this.currentBeer.date, [Validators.required]],
    });
  }

  updateBeerInfo() {
    this.beerService.saveBeer(this.beerForm.value).subscribe((res: any) => {
      this.beerService.getBeerList().subscribe((beers) => {
        this.beerService.updateBeerList(beers as Beer[]);
      });
      alert(res.message);
      this.dialog.closeAll();
    });
  }

  deleteBeerInfo() {
    if (confirm(`Are you sure to delete '${this.currentBeer.name}' ?`)) {
      this.beerService.deleteBeer(this.beerForm.value).subscribe((res: any) => {
        this.beerService.getBeerList().subscribe((beers) => {
          this.beerService.updateBeerList(beers as Beer[]);
        });
        alert(res.message);
        this.dialog.closeAll();
      });
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
