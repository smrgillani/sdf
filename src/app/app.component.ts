import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LoaderService } from './loader.service';
import { Subscription } from 'rxjs/Subscription';
import { Message } from 'primeng/primeng';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {
  loading = true;
  growlMessage: Message[] = [];
  private loaderSubscription = new Subscription();
  private growlSubscription = new Subscription();

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loaderSubscription = this.loaderService.loaderStatus.subscribe((status: boolean) => {
      this.loading = status;
    });

    this.growlSubscription = this.loaderService.growlMessage.subscribe((message: Message) => {
      if (message) {
        this.growlMessage.push(message);

        setTimeout(() => {
          this.growlMessage.pop();
        }, 3000);
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.growlSubscription.unsubscribe();
  }
}
