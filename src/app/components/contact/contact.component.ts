import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Message} from '../../logic/Message';
import {MessageService} from '../../logic/MessageService';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {ReCaptchaComponent} from 'angular2-recaptcha';
import {AngularFireStorage, AngularFireUploadTask} from 'angularfire2/storage';
import {Observable} from 'rxjs/Rx';
import {promise} from 'selenium-webdriver';
import {AngularFireDatabase} from 'angularfire2/database';

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

  // Main task
  task: AngularFireUploadTask;

  // Download URL
  downloadURL: Promise<string>;
  downloadLink: Observable<string>;

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
    Validators.maxLength(1000)
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
    console.log('RESPONSE TOKEN: ' + token);

    // check if captcha validation was successful
    if (this.captcha.getResponse() === '') {
      console.log('Recaptcha failed: ' + this.captcha.getResponse());
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else if (this.message.subject.length == 0 || this.message.name.length == 0 || this.message.email.length == 0 || this.message.body.length == 0) {
      this.dialogText = 'Failed to send, please check your input and try again.';
    }
    else {
      let tmpData;

      let tmpMessage = new Message();
      tmpMessage.name = this.message.name;
      tmpMessage.email = this.message.email;
      tmpMessage.phone = this.message.phone;
      tmpMessage.body = this.message.body;
      tmpMessage.subject = this.message.subject;

      let numOfFiles = this.files.length - 1;

      for (let i = 0; i < this.files.length; i++) {
        this.task = this.storage.upload(`customer_attachments/${new Date().getTime()}_${tmpMessage.email}_${this.files.indexOf(this.files[i])}`, this.files[i]);

        this.task.downloadURL().subscribe((data: any) => {
          if (data) {
            tmpData = data;
            console.log("file: " + tmpData);

            tmpMessage.photoUrl.push(tmpData);

            // do that at the last iteration of the for loop
            if (i == numOfFiles) {
              this.messageService.insertMessage(tmpMessage);
              sendToDatabase(tmpMessage, this.messageService);
            }
          }
        });
      }

      // upload photos to firebase
      /*for (let file of this.files) {

        this.task = this.storage.upload(`customer_attachments/${new Date().getTime()}_${this.message.email}_${this.files.indexOf(file)}`, file);

        this.task.downloadURL().subscribe((data: any) => {
          if (data) {
            link = data;
            console.log(link);

            //this.messageService.insertImageUrl(link, name, new Date().getTime());

            // TODO add link to array instead of uploading
            urls.push(link);

            tmpMessage.photoUrl = urls[0];
          }
        });
      }

      setTimeout(function () {
        //let firebase = new AngularFireDatabase();
        console.log(tmpMessage);
        console.log(this.messageService);
        //firebase.database.ref().child('messages').child(tmpMessage.name).set(tmpMessage);
        this.messageService.insertMessage(this.message);
      }, 5000);*/

      this.dialogText = 'Message sent, thank you. We will be in touch shortly.';

      this.message.subject = '';
      this.message.name = '';
      this.message.email = '';
      this.message.phone = null;
      this.message.body = '';

      this.resetForm();
    }

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function sendToDatabase(message : Message, messageService : MessageService) {
      console.log('Taking a break...');
      await sleep(5000);
      console.log('Five seconds later');
      messageService.insertMessage(message);
    }

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
