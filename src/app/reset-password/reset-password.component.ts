import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from '../enum/alert-type.enum';
import { AccountService } from '../service/account.service';
import { AlertService } from '../service/alert.service';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit,OnDestroy {

  
  private subscriptions: Subscription[] = [];

  constructor(
    private accountService: AccountService,
    private loadingService: LoadingService,
    private router: Router,
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
      this.router.navigateByUrl('/resetpassword');
    }
  }

  onResetpassword(form:any): void {
    this.loadingService.isLoading.next(true);
    console.log(form.email);
    const email: string = form.email;
    this.subscriptions.push(
      this.accountService.resetPassword(email).subscribe(
        response => {
          console.log(response);
          this.loadingService.isLoading.next(false);
          this.alertService.showAlert(
            'A new password has been sent to your email.',
            AlertType.SUCCESS
          );
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          const errorMsg = error.error;
          if (errorMsg === 'emailNotFound') {
            this.alertService.showAlert(
              'There is no account for this email. Please verify the email.',
              AlertType.DANGER
            );
          }
          if (errorMsg !== 'emailNotFound') {
            this.alertService.showAlert(
              'Some error occured. Please try again.',
              AlertType.DANGER
            );
          }
          this.loadingService.isLoading.next(false);
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
