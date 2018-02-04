import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

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
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  options: FormGroup;

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

  matcher = new MyErrorStateMatcher();

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }

  cancel() {

  }

  save() {

  }

}
