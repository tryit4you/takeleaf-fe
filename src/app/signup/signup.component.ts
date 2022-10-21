import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from '../enum/alert-type.enum';
import { AccountService } from '../service/account.service';
import { AlertService } from '../service/alert.service';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit,OnDestroy {

  private subscriptions: Subscription[] = [];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    if (this.accountService.isLoggedIn()) {
      if (this.accountService.redirectUrl) {
        this.router.navigateByUrl(this.accountService.redirectUrl);
      } else {
        this.router.navigateByUrl('/home');
      }
    } else {
      this.router.navigateByUrl('/signup');
    }
  }

  onRegister(user:any): void {
    this.loadingService.isLoading.next(true);
    console.log(user);
    this.subscriptions.push(
    this.accountService.register(user).subscribe(
      response => {
        this.loadingService.isLoading.next(false);
        this.alertService.showAlert(
          'You have registered successfully. Please check your email for account details.',
          AlertType.SUCCESS
        );
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.loadingService.isLoading.next(false);
        const errorMsg: string = error.error;
        if (errorMsg === 'usernameExist') {
          this.alertService.showAlert(
            'This username already exists. Please try with a different username',
            AlertType.DANGER
          );
        } else if (errorMsg === 'emailExist') {
          this.alertService.showAlert(
            'This email address already exists. Please try with a different email',
            AlertType.DANGER
          );
        } else {
          this.alertService.showAlert(
            'Something went wrong. Please try again.',
            AlertType.DANGER
          );
        }
      }
    )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
