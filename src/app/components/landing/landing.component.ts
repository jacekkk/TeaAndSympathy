import { Component, OnInit } from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  landingContent: Entry<any>[] = [];

  landingFurniture: Entry<any>[] = [];

  landingHomeware: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {

    this.contentfulService.getLandingContent()
    .then(landingContent=> this.landingContent = landingContent);

    this.contentfulService.getLandingFurniture()
    .then(landingFurniture=> this.landingFurniture = landingFurniture);

    this.contentfulService.getLandingHomeware()
    .then(landingHomeware=> this.landingHomeware = landingHomeware);
  }

}
