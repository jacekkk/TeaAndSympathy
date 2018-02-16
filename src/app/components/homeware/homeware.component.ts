import { Component, OnInit } from '@angular/core';
import { ContentfulService } from '../../contentful.service';
import {Entry} from 'contentful';

@Component({
  selector: 'homeware',
  templateUrl: './homeware.component.html',
  styleUrls: ['./homeware.component.css']
})
export class HomewareComponent implements OnInit {
  // define private class properties
  private homewareItems: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {
    this.contentfulService.getHomewareItems()
      .then(homeware => this.homewareItems = homeware)
  }

}
