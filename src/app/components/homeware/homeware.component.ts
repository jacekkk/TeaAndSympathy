import {Component, Inject, OnInit} from '@angular/core';
import {ContentfulService} from '../../contentful.service';
import {Entry} from 'contentful';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {ViewEncapsulation} from '@angular/core';
import {AfterViewChecked} from '@angular/core';

@Component({
  selector: 'homeware',
  templateUrl: './homeware.component.html',
  styleUrls: ['./homeware.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HomewareComponent implements OnInit, AfterViewChecked {
  // define private class properties
  homewareItems: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentfulService.getHomewareItems()
      .then(homeware => this.homewareItems = homeware);
  }

  ngAfterViewChecked() {
    for (let homewareItem of this.homewareItems) {
      let id = this.homewareItems.indexOf(homewareItem);

      let textArea = document.getElementById('text' + id);
      let icon = document.getElementById('icon' + id);

      let scrollHeight = textArea.scrollHeight;
      let offsetHeight = textArea.offsetHeight;
2
      console.log('Scroll height: ' + scrollHeight);
      console.log('Offset height: ' + offsetHeight);

      if (scrollHeight == offsetHeight && scrollHeight < 200) {
        console.log('this one hidden');
        icon.hidden = true;
      }
    }
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

  toggleTextHeight(id) {
    let textArea = document.getElementById('text' + id);
    let icon = document.getElementById('icon' + id);

    if (textArea.style.maxHeight == '200px') {
      textArea.style.maxHeight = '2000px';
      icon.className = 'fa fa-caret-up';
    }
    else {
      textArea.style.maxHeight = '200px';
      icon.className = 'fa fa-caret-down';
    }
  }
}

// dialog component
@Component({
  selector: 'dialog-homeware-product',
  templateUrl: 'dialog-homeware-product.html',
  styleUrls: ['./dialog-homeware-product.css'],
  providers: [NgbCarouselConfig]
})
export class DialogHomewareProduct {
  constructor(public dialogRef: MatDialogRef<DialogHomewareProduct>,
              @Inject(MAT_DIALOG_DATA) public data: any, config: NgbCarouselConfig) {
    config.interval = 10000;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
