import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public submitted = false;
  public showPwd = false;
  public showConfirm = false;
  public showMessage = false;
  public isSuccess = false;
  public isFail = false;
  public token = '';

  public isLoading=false;

  public form: FormGroup = new FormGroup({
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });


  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadToken();
    this.checkToken(this.token);

    this.form = this.formBuilder.group({
      confirmPassword: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(40),
        ],
      ],
    });
  }

  public loadToken() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  public get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public onSubmit() {
    this.isLoading=true;
    this.submitted = true;
    this.userService.updatePassword(this.token, this.form.value.password).subscribe({
      next: (response: string) => {
        if (response) {
          this.isSuccess = true;
          this.isFail = false;
          this.isLoading=false;
        } else {
          this.isFail = true;
          this.isSuccess = false;
          this.isLoading=false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log("Check token: " + error.message);
      }
    });
  }

  public checkToken(token: string) {
    this.userService.checkValidToken(token).subscribe({
      next: (response: boolean) => {
        if (response) {
          this.showMessage = false;
        } else {
          this.showMessage = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log("Check token: " + error.message);
      }
    });
  }
}
