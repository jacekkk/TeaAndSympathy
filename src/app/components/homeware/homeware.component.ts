import { Component, OnInit } from '@angular/core';
import { ContentfulService } from '../../contentful.service';
import {MatButtonModule} from '@angular/material/button';
import {Entry} from 'contentful';

@Component({
  selector: 'homeware',
  templateUrl: './homeware.component.html',
  styleUrls: ['./homeware.component.css']
})
export class HomewareComponent implements OnInit {
  tiles = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  // define private class properties
  private homewareItems: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {
    this.contentfulService.getHomewareItems()
      .then(homeware => this.homewareItems = homeware)
  }

}
