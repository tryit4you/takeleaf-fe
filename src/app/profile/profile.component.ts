import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertType } from '../enum/alert-type.enum';
import { PasswordChange } from '../models/password-change';
import { Post } from '../models/post';
import { User } from '../models/user';
import { AccountService } from '../service/account.service';
import { AlertService } from '../service/alert.service';
import { LoadingService } from '../service/loading.service';
import { PostService } from '../service/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit ,OnDestroy{
  private subscriptions: Subscription[] = [];
  postId: any;
  posts: any;
  user: any;
  host: any;
  userHost: any;
  postHost: any;
  username: any;
  profilePictureChange: any;
  profilePicture: any;

  constructor(
    private route: ActivatedRoute,
    public accountService: AccountService,
    private postService: PostService,
    private router: Router,
    private loadingService: LoadingService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadingService.isLoading.next(true);
    this.username = this.route.snapshot.paramMap.get('username');
    this.host = this.postService.host;
    this.userHost = this.postService.userHost;
    this.postHost = this.postService.postHost;
    this.getUserInfo(this.username);
    this.loadingService.isLoading.next(false);
  }

  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
        (response: User) => {
          this.user = response;
          this.getPostsByUsername(this.user.username);
        },
        error => {
          console.log(error);
          this.user = new User();
        }
      )
    );
  }

  getPostsByUsername(username: string): void {
    this.subscriptions.push(
      this.postService.getPostsByUsername(username).subscribe(
        (response: Post[]) => {
          this.user.post = response;
        },
        error => {
          console.log(error);
          this.user.post = [];
        }
      )
    );
  }

  onProfilePictureSelected(event: any): void {
    console.log(event);
    this.profilePicture = event.target.files[0] as File;
    console.log(this.profilePicture);
    this.profilePictureChange = true;
  }

  onUpdateUser(updatedUser: User): void {
    this.loadingService.isLoading.next(true);
    this.subscriptions.push(
      this.accountService.updateUser(updatedUser).subscribe(
        response => {
          console.log(response);
          if (this.profilePictureChange) {
            this.accountService.uploadeUserProfilePicture(this.profilePicture);
          }
          this.loadingService.isLoading.next(false);
          this.alertService.showAlert(
            'Profile updated successfully.',
            AlertType.SUCCESS
          );
        },
        error => {
          console.log(error);
          this.loadingService.isLoading.next(false);
          this.alertService.showAlert(
            'Profile update failed. Please try again..',
            AlertType.DANGER
          );
        }
      )
    );
  }

  onChangePassword(passwordChange: PasswordChange) {
    console.log(passwordChange);
    const element: HTMLElement = document.getElementById(
      'changePasswordDismiss'
    ) as HTMLElement;
    element.click();
    this.loadingService.isLoading.next(true);
    this.subscriptions.push(
      this.accountService.changePassword(passwordChange).subscribe(
        response => {
          console.log(response);
          this.loadingService.isLoading.next(false);
          this.alertService.showAlert(
            'Password was updated successfully',
            AlertType.SUCCESS
          );
        },
        error => {
          console.log(error);
          this.loadingService.isLoading.next(false);
          const errorMsg: string = error.error;
          this.showErrorMessage(errorMsg);
        }
      )
    );
  }

  private showErrorMessage(errorMessage: string): void {
    if (errorMessage === 'PasswordNotMatched') {
      this.alertService.showAlert(
        'Passwords do not match. Please try again.',
        AlertType.DANGER
      );
    } else if (errorMessage === 'IncorrectCurrentPassword') {
      this.alertService.showAlert(
        'The current password is incorrect. Please try again.',
        AlertType.DANGER
      );
    } else {
      this.alertService.showAlert(
        'Password change failed. Please try again.',
        AlertType.DANGER
      );
    }
  }

  seeOnePost(postId:any): void {
    this.router.navigate(['/post', postId]);
    console.log(postId);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
