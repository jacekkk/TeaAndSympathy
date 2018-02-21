import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Message} from '../../logic/Message';
import {MessageService} from '../../logic/MessageService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as firebase from 'firebase/app';
import {ReCaptchaComponent} from 'angular2-recaptcha';

declare var google: any;

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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

  // obtain reference to recaptcha element from template file
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

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
              public dialog: MatDialog) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.message = new Message();
    this.initMap();
  }

  initMap() {
    const cafeLocation = {lat: 55.932594, lng: -3.228151};

    let mapProp = {
      center: new google.maps.LatLng(cafeLocation),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    let map = new google.maps.Map(document.getElementById('map'), mapProp);

    const marker = new google.maps.Marker({
      position: cafeLocation,
      map: map
    });
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

    this.captcha.reset();
  }

  // handles user's attempt to submit the form once he clicks "Send" button
  onSend() {
    console.log(this.message);

    let token = this.captcha.getResponse();
    console.log("RESPONSE TOKEN: " + token);

    // check if captcha validation was successful
    if (this.captcha.getResponse() === '') {
      console.log('Recaptcha failed: ' + this.captcha.getResponse());
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else if (this.message.subject.length == 0 || this.message.name.length == 0 || this.message.email.length == 0 || this.message.body.length == 0) {
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else {
      this.messageService.insertMessage(this.message);

      this.dialogText = 'Message sent, thank you. We will be in touch shortly.';

      this.message.subject = '';
      this.message.name = '';
      this.message.email = '';
      this.message.phone = null;
      this.message.body = '';

      this.resetForm();
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
