import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

import { UserCountryService } from '../../core/user-country.service';
import { RoleService } from '../../core/role.service';
import Roles from 'app/core/models/Roles.enum';
import Country from 'app/core/models/Country';


@Component({
    selector: 'app-select-country',
    templateUrl: './select-country.component.html',
    styleUrls: [
        './select-country.component.scss'
    ],
    providers: [UserCountryService],
    animations: [
        trigger('pageState', [
            state('visible', style({
                opacity: 1
            })),
            state('hidden', style({
                opacity: 0
            })),
            transition('* => visible', [
                animate(500, keyframes([
                    style({ opacity: 0, transform: 'scale(0.1)', offset: 0 }),
                    style({ opacity: 1, transform: 'scale(0.7)', offset: 1 })
                ]))
            ]),
            transition('visible => *', [
                animate(500, keyframes([
                    style({ opacity: 1, transform: 'scale(0.7)', offset: 0 }),
                    style({ opacity: 0, transform: 'scale(0.1)', offset: 1.0 })
                ]))
            ])
        ])
    ]
})
export class SelectCountryComponent implements OnInit {
    Roles = Roles;
    pageState = 'visible';
    availableCountries: Country[];

    constructor(
        private router: Router,
        private userCountryService: UserCountryService,
        private roleService: RoleService
    ) {
    }

    ngOnInit() {
        this.userCountryService.getUserCountry()
            .subscribe((data) => {
                if (!data) {
                    // following line is commented to make change for US as the default country and not give any option to select other
                    // this.getAvailableCountries();
                  this.setCountry(840); // 840 is the country id of US
                  this.navigateToNext();
                } else {
                  this.navigateToNext();
                }
            }, (error) => {
                console.log('Error while fetching the user country', error);
            });

    }

    getAvailableCountries() {
        this.userCountryService.getAvailableCountries()
            .subscribe((data) => {
                this.availableCountries = data;
                console.log('available countries', this.availableCountries);
            }, (error) => {
                console.log(error);
            });
    }

    setCountry(countryId: number) {
        this.userCountryService.setCountry(countryId).subscribe(() => {
            this.navigateToNext();
        });
    }

    navigateToNext(){
        this.roleService.getPrimaryRole()
        .subscribe((role: Roles) => {
          if (role) {
            this.roleService.setCurrentRole(role);
            this.router.navigate([this.roleService.getCurrentHome()]);
          } else {
            this.router.navigate(['/role']);
          }
        });
    }

    public animationDone(event) {
        if (event.triggerName === 'pageState' && event.toState === 'hidden') {
        }
    }
}
