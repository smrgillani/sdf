import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { TransactionService } from 'app/common/services/transaction.service';
import { RoleService } from 'app/core/role.service';

@Component({
  selector: 'app-transfer-overview',
  templateUrl: './transfer-overview.component.html',
  styleUrls: ['./transfer-overview.component.scss'],
})
export class TransferOverviewComponent implements OnInit {
  searchText: '';
  searching = false;
  searchFailed = false;
  is_self = true;
  currentRole: any;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute,
    private roleService: RoleService,
  ) { }

  ngOnInit() {
    this.getUserRole();
    if (this.currentRole !== 'creator') {
      this.is_self = false;
    }
  }

  selectUser(event) {
    event.preventDefault();
    this.searchText = event.item.name;
    this.router.navigate([`../${event.item.id}/transfer`], {relativeTo: this.route});
  }

  userFormatter = (result: object) => result;

  searchUser = (text$: Observable<string>) => {
    return text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.transactionService.getUserList(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed);
  };

  getUserRole() {
    this.currentRole = this.roleService.getCurrentRole();
  }
}
