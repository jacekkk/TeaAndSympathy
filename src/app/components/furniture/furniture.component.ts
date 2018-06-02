import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Entry} from 'contentful';
import {ContentfulService} from '../../contentful.service';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {ViewEncapsulation} from '@angular/core';
import {AfterViewChecked} from '@angular/core';

@Component({
  selector: 'furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class FurnitureComponent implements OnInit, AfterViewChecked {
  // define private class properties
  furnitureItems: Entry<any>[] = [];

  constructor(private contentfulService: ContentfulService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.contentfulService.getFurnitureItems()
      .then(furniture => this.furnitureItems = furniture);

    console.log('onInit');
  }

  ngAfterViewChecked() {
    for (let furnitureItem of this.furnitureItems) {
      let id = this.furnitureItems.indexOf(furnitureItem);

      let textArea = document.getElementById('text' + id);
      let icon = document.getElementById('icon' + id);

      let scrollHeight = textArea.scrollHeight;
      let offsetHeight = textArea.offsetHeight;

      console.log('Scroll height: ' + scrollHeight);
      console.log('Offset height: ' + offsetHeight);

      if (scrollHeight == offsetHeight && scrollHeight < 200) {
        console.log('this one hidden');
        icon.hidden = true;
      }
    }
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
  selector: 'dialog-furniture-product',
  templateUrl: 'dialog-furniture-product.html',
  styleUrls: ['./dialog-furniture-product.css'],
  providers: [NgbCarouselConfig]
})
export class DialogFurnitureProduct {
  constructor(public dialogRef: MatDialogRef<DialogFurnitureProduct>,
              @Inject(MAT_DIALOG_DATA) public data: any, config: NgbCarouselConfig) {
    config.interval = 10000;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
