import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alert } from './models/alert';
import { LoadingService } from './service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{

  private subscriptions: Subscription[] = [];
  public alerts: Alert[] = [];
  public loading: boolean=false;
  constructor(private loadingService: LoadingService, private alertService: AlertService) {
    this.loading = false;
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.loadingService.isLoading.subscribe(isLoading => {
        this.loading = isLoading;
      })
    );
    this.subscriptions.push(
      this.alertService.alerts.subscribe((alert: Alert) => {
        this.alerts.push(alert);
        this.closeAlert(3);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());

  }

  private closeAlert(second: number): void {
    setTimeout(() => {
      const element: HTMLElement = document.getElementById('dismissAlert') as HTMLElement;
      element.click();
    }, second * 1000);
  }
}
