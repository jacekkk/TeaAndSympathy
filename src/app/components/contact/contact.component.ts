import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Message} from '../../logic/Message';
import {MessageService} from '../../logic/MessageService';
import {MatSnackBar} from '@angular/material';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {text} from '@angular/core/src/render3/instructions';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

declare var grecaptcha: any;

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})

export class ContactComponent implements OnInit {
  options: FormGroup;
  matcher = new MyErrorStateMatcher();
  message: Message;
  dialogText: string;

  // tracks the value and validation status of the email input field in the form
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
    Validators.email,
  ]);

  // tracks the value and validation status of the name input field in the form
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50),
    Validators.pattern('[a-zA-Z][a-zA-Z ]*'),
  ]);

  // tracks the value and validation status of the phone input field in the form
  phoneFormControl = new FormControl('', [
    Validators.maxLength(20),
    Validators.pattern('^([+]?\\d{1,2}[-\\s]?|)\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$'),
  ]);

  // tracks the value message text area in the form
  messageFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(1000)
  ]);

  constructor(fb: FormBuilder,
              private messageService: MessageService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.message = new Message();
  }

  // resets form to its original state
  resetForm() {
    this.emailFormControl.reset();
    this.emailFormControl.setErrors(null);
    this.nameFormControl.reset();
    this.nameFormControl.setErrors(null);
    this.phoneFormControl.reset();
    this.phoneFormControl.setErrors(null);
    this.messageFormControl.reset();
    this.messageFormControl.setErrors(null);
    grecaptcha.reset();
  }

  // handles user's attempt to submit the form once he clicks "Send" button
  onSend() {
    console.log(this.message);

    // check if captcha validation was successful
    if (grecaptcha.getResponse() === '') {
      console.log('Recaptcha failed: ' + grecaptcha.getResponse());
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else if (this.message.subject == null || this.message.name == null || this.message.email == null
      && this.message.body) {
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else {
      this.messageService.insertMessage(this.message);
      this.resetForm();

      this.dialogText = 'Message sent, thank you. We will be in touch shortly.';
    }

    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogContactForm, {
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
  selector: 'dialog-contact-form',
  templateUrl: 'dialog-contact-form.html',
})
export class DialogContactForm {
  constructor(public dialogRef: MatDialogRef<DialogContactForm>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
