import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogHomewareProduct} from '../homeware/homeware.component';

@Component({
  selector: 'furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  dialogText: string;

  constructor(public dialog: MatDialog) { }


  ngOnInit() {
    this.dialogText = "CIPKAA";
  }

  onClicked(){
    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogHomewareProduct, {
      data: {text: this.dialogText}
    });

    // scale the dialog automatically
    dialogRef.updateSize('auto', 'auto');
  }


}
