import { Component, OnInit } from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  menuFood: Entry<any>[] = [];
  menuDrinks: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {

    this.contentfulService.getMenuDrinks()
    .then(menuDrinks => this.menuDrinks = menuDrinks);


    this.contentfulService.getMenuFood()
    .then(menuFood => this.menuFood = menuFood);
  }

}
