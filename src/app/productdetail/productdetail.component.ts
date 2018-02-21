import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ContentfulService } from '../contentful.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Entry } from 'contentful';

@Component({
  selector: 'productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
  
  homwareItem: Entry<any>;

  constructor(
    private ContentfulService: ContentfulService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
    .switchMap((params: ParamMap) => this.ContentfulService.getHomewareItem(params.get('slug')))
    .subscribe(homware => this.homwareItem = homware);
  }

}
