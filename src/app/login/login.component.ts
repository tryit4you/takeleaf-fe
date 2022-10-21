import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from '../enum/alert-type.enum';
import { User } from '../models/user';
import { AccountService } from '../service/account.service';
import { AlertService } from '../service/alert.service';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private accountService: AccountService,
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
      this.router.navigateByUrl('/login');
    }
  }

  onLogin(user: User): void {
    this.loadingService.isLoading.next(true);
    console.log(user);
    this.subscriptions.push(
      this.accountService.login(user).subscribe(
        response => {
          const token: any= response.headers.get('Authorization');
          this.accountService.saveToken(token);
          if (this.accountService.redirectUrl) {
            this.router.navigateByUrl(this.accountService.redirectUrl);
          } else {
            this.router.navigateByUrl('/home');
          }
          this.loadingService.isLoading.next(false);
        },
        error => {
          console.log(error);
          this.loadingService.isLoading.next(false);
          this.alertService.showAlert(
            'Username or password incorrect. Please try again.',
            AlertType.DANGER
          );
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe);
  }
}
