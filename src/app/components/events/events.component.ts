import { Component, OnInit } from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  private events: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService) { }

  ngOnInit() {
  
    this.contentfulService.getEvent()
    .then(events=> this.events = events);
  }

}
