import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'src/app/model/message.model';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isSuccessful = false;
  isSignUpFailed = false;
  existUsername = false;
  existEmail = false;
  displayModal = false;
  errorMessage = '';
  username='';
  email='';
  public displayLoading = false;

  public submitted = false;
  public registerForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    rePassword: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private route:Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
        rePassword: ['', Validators.required],
      },

    );
  }

  public onSubmit() {
    this.displayLoading = true;
    this.submitted = true;
    console.log(this.registerForm);
    console.log(this.registerForm.value);
    const { username, email, password } = this.registerForm.value;
    this.authService.register(username, email, password).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.displayLoading = false;
        this.displayModal = true;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
        this.displayLoading = false;
      }
    });
    this.displayLoading = false;
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  public checkUsername(name:string) {
    let value:Boolean = false;
    this.userService.existsUsername(this.username).subscribe(
      (response: Boolean) => {
        value = response;
        if(value == true){
          this.existUsername = true;
        }else{
          this.existUsername = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      });    
  }

  public checkEmail(email:string) {
    let value:Boolean = false;
    this.userService.existsEmail(this.email).subscribe(
      (response: Boolean) => {
        value = response;
        if(value == true){
          this.existEmail = true;
        }else{
          this.existEmail = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      });    
  }

  public openLogin(): void{
    this.route.navigate(['/login']);
  }

  public hideDisableSubmit():boolean {
    let value = this.registerForm.invalid || this.existEmail || this.existUsername;
    return value;
  }
}
