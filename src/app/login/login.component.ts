import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loading = false;
  public submitted = false;
  public passwordTextType: boolean = true;

  onSubmit() { }

  togglePasswordTextType() { }

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebase: ServicesService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get error(): string {
    var firebaseError = this.firebase.loginerror;
    return this.fixCapitalsText(firebaseError);
  }

  initForm() {
    this.loginForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(8),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
    );
  }

  login() {
    const result: {
      [key: string]: string;
    } = {};
    Object.keys(this.f).forEach((key) => {
      result[key] = this.f[key].value;
    });
    console.log(result)
    this.firebase.login(result['email'], result['password'])
  }

  fixCapitalsText(text: string) {
    var result = "";
    var sentenceStart = true;
    var i = 0;
    var ch = '';

    for (i = 0; i < text.length; i++) {
      ch = text.charAt(i);

      if (sentenceStart && ch.match(/^\S$/)) {
        ch = ch.toUpperCase();
        sentenceStart = false;
      }
      else {
        ch = ch.toLowerCase();
      }

      if (ch.match(/^[.!?]$/)) {
        sentenceStart = true;
      }

      result += ch;
    }

    return result;
  }
}


