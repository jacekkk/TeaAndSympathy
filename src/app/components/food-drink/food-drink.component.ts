import { Component, OnInit } from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';

@Component({
  selector: 'app-food-drink',
  templateUrl: './food-drink.component.html',
  styleUrls: ['./food-drink.component.css']
})
export class FoodDrinkComponent implements OnInit {

  private menuFood: Entry<any>[] = [];
  private menuDrinks: Entry<any>[] = [];
  private suppliersText: Entry<any>[] = [];
  private suppliersPhoto: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {
    
    this.contentfulService.getMenuDrinks()
    .then(menuDrinks => this.menuDrinks = menuDrinks);

     
    this.contentfulService.getMenuFood()
    .then(menuFood => this.menuFood = menuFood);

    this.contentfulService.getSuppliersDesc()
    .then(suppliersText => this.suppliersText = suppliersText);

    this.contentfulService.getSuppliersPhoto()
    .then(suppliersPhoto => this.suppliersPhoto = suppliersPhoto);
  }
  

 

}
