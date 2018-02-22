import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentfulService.getFurnitureItems()
      .then(furniture => this.furnitureItems = furniture);
  }

  onCardClicked(furnitureItem: Entry<any>) {
    console.log(furnitureItem.fields);

    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogFurnitureProduct, {
      data: {
        title: furnitureItem.fields.title,
        photos: furnitureItem.fields.photos,
        price: furnitureItem.fields.price,
        description: furnitureItem.fields.description
      }
    });

    // scale the dialog automatically
    // dialogRef.updateSize('auto', 'auto');

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

// dialog component
@Component({
  selector: 'dialog-furniture-product',
  templateUrl: 'dialog-furniture-product.html'
})
export class DialogFurnitureProduct {
  constructor(public dialogRef: MatDialogRef<DialogFurnitureProduct>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
