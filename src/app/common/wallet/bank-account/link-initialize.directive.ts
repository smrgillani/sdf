import { Directive, ElementRef, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

declare const Plaid: any;

@Directive({
  selector: '[linkInitialize]'
})

export class LinkInitializeDirective implements OnInit {
  linkHandler: any;
  @Output() successEvent = new EventEmitter<any>();
  @Input() userToken: string;

  constructor(private el: ElementRef) {

  }

  ngOnInit() {

    let self = this;

    this.linkHandler = Plaid.create({
       env: 'sandbox',
       clientName: 'Saffron',
       // Replace '<PUBLIC_KEY>' with your own `public_key`
       key: environment.plaidPublicKey,
       product: ['auth'],
       selectAccount: true,
       token:self.userToken,
       onSuccess: function(public_token, metadata) {
         // Send the public_token to your app server here.
         // The metadata object contains info about the
         // institution the user selected and the
         // account_id, if selectAccount is enabled.
          console.log("Token: " + public_token + " Metadata: " + metadata);
          console.log(metadata);
          self.successEvent.emit(metadata);
        },
       onExit: function(err, metadata) {
         // The user exited the Link flow.
         if (err != null) {
            console.log("Error: " + err);
         }
         // metadata contains information about the
         // institution that the user selected and the
         // most recent API request IDs. Storing this
         // information can be helpful for support.
       }
      });

      // Trigger the standard institution select view
      console.log(`directive element ref`,this.el,this.el.nativeElement.firstElementChild);

      this.el.nativeElement.onclick = function() {
            self.linkHandler.open();
        };
  }
}