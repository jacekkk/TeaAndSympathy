import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogHomewareProduct} from '../homeware/homeware.component';
import {Entry} from 'contentful';
import {ContentfulService} from '../../contentful.service';

@Component({
  selector: 'furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  // define private class properties
  private furnitureItems: Entry<any>[] = [];

  dialogText: string;

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.dialogText = 'CIPKAA';

    this.contentfulService.getFurnitureItems()
      .then(furniture => this.furnitureItems = furniture);
  }

  onClicked() {
    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogHomewareProduct, {
      data: {text: this.dialogText}
    });

    // scale the dialog automatically
    dialogRef.updateSize('auto', 'auto');
  }


}
