import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Message} from '../../logic/Message';
import {MessageService} from '../../logic/MessageService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/first';

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

  files = [];
  path: string;

  sendButtonText = 'Send';

  spinnerButton: any;

  // reference to recaptcha element from template file
  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  // reference to uploadResponse element from template file
  @ViewChild('uploadResponse') uploadResp: ElementRef;

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
    Validators.maxLength(2000)
  ]);

  constructor(fb: FormBuilder,
              private messageService: MessageService,
              public dialog: MatDialog,
              private storage: AngularFireStorage) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.message = new Message();
    this.initMap();

    this.spinnerButton = document.getElementById('spinner');
    this.spinnerButton.hidden = true;
  }

  getFiles(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      console.log('event length: ' + event.length);

      let file = event.item(i);
      let content: Text;
      let br = document.createElement('br');

      if (this.files.length >= 5) {
        content = document.createTextNode('Too many photos - up to 5 allowed');
      }
      else if (file.type.split('/')[0] !== 'image') {
        content = document.createTextNode(file.name + ' is not an image!');
      }
      else if (file.size > 5242880) {
        content = document.createTextNode(file.name + ' is too big - max size is 5 MB');
      }
      else {
        this.files.push(file);
        content = document.createTextNode(file.name + ' attached successfully');
      }

      console.log('File size: ' + file.size);

      this.uploadResp.nativeElement.appendChild(content);
      this.uploadResp.nativeElement.appendChild(br);
    }

    console.log('Num of files: ' + this.files.length);
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

    // reset recaptcha
    this.captcha.reset();

    // clear the files array after files have been uploaded
    this.files = [];

    // remove all child nodes from 'uploadResponse' div
    while (this.uploadResp.nativeElement.hasChildNodes()) {
      this.uploadResp.nativeElement.removeChild(this.uploadResp.nativeElement.lastChild);
    }
  }

  // handles user's attempt to submit the form once he clicks "Send" button
  onSend() {
    let token = this.captcha.getResponse();
    //console.log('CAPTCHA RESPONSE TOKEN: ' + token);

    // check if captcha validation was successful
    if (this.captcha.getResponse() === '') {
      console.log('Recaptcha failed: ' + this.captcha.getResponse());
      this.dialogText = 'Failed to send, please check your input and try again.';
      this.openDialog();
    }
    else if (this.message.subject.length == 0 || this.message.name.length == 0 || this.message.email.length == 0 || this.message.body.length == 0) {
      this.dialogText = 'Failed to send, please check your input and try again.';
      this.openDialog();
    }
    else {
      this.sendButtonText = 'Sending...';
      this.spinnerButton.hidden = false;

      let tmpMessage = new Message();
      tmpMessage.name = this.message.name;
      tmpMessage.email = this.message.email;
      tmpMessage.phone = this.message.phone;
      tmpMessage.body = this.message.body;
      tmpMessage.subject = this.message.subject;

      console.log('Number of files: ' + this.files.length);

      switch (this.files.length) {
        case 0: {
          this.messageService.insertMessage(tmpMessage);
          console.log('Written to db' + tmpMessage.toString());

          this.onSendSuccessful();

          break;
        }
        case 1: {
          Observable.zip(this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[0])}`, this.files[0])
            .downloadURL())
            .subscribe(([a]) => {
                tmpMessage.photoUrl.push(a);
                console.log('Pushed ' + a);
              },
              error => console.log('Error: ', error),
              () => {
                this.messageService.insertMessage(tmpMessage);
                console.log('Written to db: ' + tmpMessage.toString());

                this.onSendSuccessful();
              }
            );
          break;
        }
        case 2: {
          Observable.zip(this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[0])}`, this.files[0])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[1])}`, this.files[1])
            .downloadURL())
            .subscribe(([a, b]) => {
                tmpMessage.photoUrl.push(a);
                console.log('Pushed ' + a);

                tmpMessage.photoUrl.push(b);
                console.log('Pushed ' + b);
              },
              error => console.log('Error: ', error),
              () => {
                this.messageService.insertMessage(tmpMessage);
                console.log('Written to db: ' + tmpMessage.toString());

                this.onSendSuccessful();
              }
            );
          break;
        }
        case 3: {
          Observable.zip(this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[0])}`, this.files[0])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[1])}`, this.files[1])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[2])}`, this.files[2])
            .downloadURL())
            .subscribe(([a, b, c]) => {
                tmpMessage.photoUrl.push(a);
                console.log('Pushed ' + a);

                tmpMessage.photoUrl.push(b);
                console.log('Pushed ' + b);

                tmpMessage.photoUrl.push(c);
                console.log('Pushed ' + c);
              },
              error => console.log('Error: ', error),
              () => {
                this.messageService.insertMessage(tmpMessage);
                console.log('Written to db: ' + tmpMessage.toString());

                this.onSendSuccessful();
              }
            );
          break;
        }
        case 4: {
          Observable.zip(this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[0])}`, this.files[0])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[1])}`, this.files[1])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[2])}`, this.files[2])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[3])}`, this.files[3])
            .downloadURL())
            .subscribe(([a, b, c, d]) => {
                tmpMessage.photoUrl.push(a);
                console.log('Pushed ' + a);

                tmpMessage.photoUrl.push(b);
                console.log('Pushed ' + b);

                tmpMessage.photoUrl.push(c);
                console.log('Pushed ' + c);

                tmpMessage.photoUrl.push(d);
                console.log('Pushed ' + d);
              },
              error => console.log('Error: ', error),
              () => {
                this.messageService.insertMessage(tmpMessage);
                console.log('Written to db: ' + tmpMessage.toString());

                this.onSendSuccessful();
              }
            );
          break;
        }
        case 5: {
          Observable.zip(this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[0])}`, this.files[0])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[1])}`, this.files[1])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[2])}`, this.files[2])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[3])}`, this.files[3])
            .downloadURL(), this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[4])}`, this.files[4])
            .downloadURL())
            .subscribe(([a, b, c, d, e]) => {
                tmpMessage.photoUrl.push(a);
                console.log('Pushed ' + a);

                tmpMessage.photoUrl.push(b);
                console.log('Pushed ' + b);

                tmpMessage.photoUrl.push(c);
                console.log('Pushed ' + c);

                tmpMessage.photoUrl.push(d);
                console.log('Pushed ' + d);

                tmpMessage.photoUrl.push(e);
                console.log('Pushed ' + e);
              },
              error => console.log('Error: ', error),
              () => {
                this.messageService.insertMessage(tmpMessage);
                console.log('Written to db: ' + tmpMessage.toString());

                this.onSendSuccessful();
              }
            );
          break;
        }
        default: {
          //statements;
          break;
        }
      }
    }
  }

  onSendSuccessful() {
    this.sendButtonText = 'Send';
    this.spinnerButton.hidden = true;

    this.dialogText = 'Message sent, thank you. We will be in touch shortly.';

    this.message.subject = '';
    this.message.name = '';
    this.message.email = '';
    this.message.phone = null;
    this.message.body = '';

    this.resetForm();

    this.openDialog();
  }

  openDialog() {
    // open dialog after user has attempted to send the form
    let dialogRef = this.dialog.open(DialogContactForm, {
      data: {text: this.dialogText}
    });

    // scale the dialog automatically
    dialogRef.updateSize('auto', 'auto');

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

}

// onSend dialog component
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
