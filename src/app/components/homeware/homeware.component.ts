import {Component, Inject, OnInit} from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {MatButtonModule} from '@angular/material/button';
import {Entry} from 'contentful';
import {forEach} from '@angular/router/src/utils/collection';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'homeware',
  templateUrl: './homeware.component.html',
  styleUrls: ['./homeware.component.css']
})
export class HomewareComponent implements OnInit {
  // define private class properties
  private homewareItems: Entry<any>[] = [];
  dialogText: string;

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentfulService.getHomewareItems()
      .then(homeware => this.homewareItems = homeware);
  }

  onCardClicked() {
    console.log("clicked!");
    this.dialogText = 'Fuckyou Joe!!';

    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogHomewareProduct, {
      data: {text: this.dialogText}
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
})
export class DialogHomewareProduct {
  constructor(public dialogRef: MatDialogRef<DialogHomewareProduct>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(){
    console.log("on init dialog");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
