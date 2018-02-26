import {Component, Inject, OnInit} from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'homeware',
  templateUrl: './homeware.component.html',
  styleUrls: ['./homeware.component.css']
})
export class HomewareComponent implements OnInit {
  // define private class properties
  private homewareItems: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentfulService.getHomewareItems()
      .then(homeware => this.homewareItems = homeware);

  }

  onCardClicked(homewareItem: Entry<any>) {
    console.log(homewareItem.fields);

    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogHomewareProduct, {
      data: {
        title: homewareItem.fields.title,
        photos: homewareItem.fields.photos,
        price: homewareItem.fields.price,
        description: homewareItem.fields.description
      }
    });

    // scale the dialog automatically
    dialogRef.updateSize('auto', 'auto');

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

// dialog component
@Component({
  selector: 'dialog-homeware-product',
  templateUrl: 'dialog-homeware-product.html',
  styleUrls: ['./dialog-homeware-product.css']
})
export class DialogHomewareProduct {
  constructor(public dialogRef: MatDialogRef<DialogHomewareProduct>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
