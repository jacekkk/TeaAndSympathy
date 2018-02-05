import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Message } from '../../logic/Message';
import { MessageService } from '../../logic/MessageService';

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
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit
{
  options: FormGroup;
  matcher = new MyErrorStateMatcher();
  message: Message;

  // tracks the value and validation status of the email input field in the form
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  // tracks the value and validation status of the name input field in the form
  nameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('[a-zA-Z][a-zA-Z ]*'),
  ]);

  // tracks the value and validation status of the phone input field in the form
  phoneFormControl = new FormControl('', [
    Validators.pattern('^([+]?\\d{1,2}[-\\s]?|)\\d{3}[-\\s]?\\d{3}[-\\s]?\\d{4}$'),
  ]);

  constructor(fb: FormBuilder,
              private messageService: MessageService) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.message = new Message();
  }

  onSend() {
    if(grecaptcha.getResponse() === '')
    {
      console.log('Recaptcha failed');
    }
    else
    {
      this.messageService.insertMessage(this.message);
      console.log(this.message);
      console.log(grecaptcha.getResponse());
    }

  }

  onCancel() {
  }
}
