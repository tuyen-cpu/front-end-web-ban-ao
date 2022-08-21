import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth.service';
import { StorageService } from 'src/app/service/storage.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.scss',
    './../register/register.component.scss',
  ],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  public existEmail = true;
  public isLoadingForgotPwd = false;
  
  public msgs1: Message[] = [];
  
  public displayLoading = false;
  public submittedForget = false;
  public submitted = false;
  public isLoginFailed = false;
  public errorMessage = '';
  public loginForm: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public rePwdForm: FormGroup = new FormGroup({
    email: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
    });
    this.rePwdForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public onSubmitLogin() {
    this.displayLoading = true;
    this.submitted = true;

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (data) => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.displayLoading = false;
        const isAdmin: boolean = data.roles.includes("admin");
        if(isAdmin){
          this.router.navigate(['/admin']);
        }
        else{
          this.router.navigate(['']);
        }
      },
      error: (err) => {
        this.isLoginFailed = true;
        this.displayLoading = false;
      },
    });
    this.displayLoading = false;
  }
  public onSubmitRePwd() {
    this.submittedForget = true;
    // console.log(this.rePwdForm);
    // console.log(this.rePwdForm.value);
    this.isLoadingForgotPwd = true;
    this.userService.forgotPassword(this.rePwdForm.value.email).subscribe(
      (response: boolean) => {
        if(response){
          this.msgs1=[];
          this.msgs1.push({severity:'success', summary:'Success', detail:'Vui lòng kiểm tra mail để cập nhật lại mật khẩu.'})
        }else{
          this.msgs1=[];
          this.msgs1.push({severity:'error', summary:'Error', detail:'Email không hợp lệ. Vui lòng kiểm tra lại.'})
        }
        this.isLoadingForgotPwd = false;
      },
      (error: HttpErrorResponse) => {
        this.isLoadingForgotPwd = false;
        console.log("Forgot: "+error.message);
      });    
      
  }

  public get fLogin(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  public get fPwd(): { [key: string]: AbstractControl } {
    return this.rePwdForm.controls;
  }

  public checkEmail(event:any) {
    let value:Boolean = false;
    this.userService.existsEmail(event.target.value).subscribe(
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
}
