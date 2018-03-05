import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'heading',
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.css']
})
export class HeadingComponent implements OnInit {

  public location = '' ;

  constructor(private  _router : Router) 
  {      
    
  }

  ngOnInit() {
  }

}
