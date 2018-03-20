import { Component, OnInit, Directive,ElementRef } from '@angular/core';
import {Router} from '@angular/router';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  public location = '' ;
  dangerousUrl: any;
  trustedUrl:any;

  
  private homePhoto: Entry<any>[] = [];

  constructor(private  _router : Router, private contentfulService: ContentfulService,private _sanitizer: DomSanitizer) {}

  public sanitizeImage(image: string) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  

  ngOnInit() {

    this.contentfulService.getHomePhoto()
    .then(homePhoto=> this.homePhoto = homePhoto);
  }

}
