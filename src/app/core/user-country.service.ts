import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import Country from './models/Country';

import { environment } from '../../environments/environment';
import { AccountService } from '../founder/account/account.service';
import UserProfileModel from './models/UserProfileModel';


/**
 * User Country Service
 * Service provides functions for operations with user country
 */
@Injectable()
export class UserCountryService {
  private cachedCountries: Country[];

  constructor(
    private authHttp: AuthHttp,
    private accountService: AccountService,
  ) {
  }

  /**
   * Set user country on server
   *
   * @param country - country to set on server
   * */
  setCountry(countryId: number): Observable<any> {
    const body = JSON.stringify({registration_country: countryId});

    return this.accountService.setProfile(body)
      .map((profile: UserProfileModel) => {
        if (profile.registration_country) {
          this.setUserCountryIntoLocal(profile.registration_country.id.toString(), profile.registration_country.title);
        } else {
          this.setUserCountryIntoLocal(null, null);
        }

        return profile.registration_country;
      })
      .catch((error: any) => Observable.throw(error || 'set country error'));
  }

  /**
   *  @deprecated unnecessary after API changed
   * */
  getAvailableCountries(): Observable<Country[]> {
    if (this.cachedCountries) {
      return Observable.of((this.cachedCountries));
    }

    return this.authHttp.get(environment.server + '/registration-country-list/')
      .map((response: Response) => {
        this.cachedCountries = response.json();
        return this.cachedCountries;
      })
      .catch((error: any) => {
        return Observable.throw(error || 'get countries error');
      });
  }

  /**
   * Get user country from server
   *
   * @returns user country
   * */
  getUserCountry(): Observable<Country> {
    return this.accountService.getProfile().map((profile: UserProfileModel) => {
      if (profile.registration_country) {
        this.setUserCountryIntoLocal(profile.registration_country.id.toString(), profile.registration_country.title);
      } else {
        this.setUserCountryIntoLocal(null, null);
      }

      return profile.registration_country;
    });
  }

  /**
   * Set user country in localstorage
   *
   * @param country - country to set in localstorage
   * */
  setUserCountryIntoLocal(countryId: string, countryName: string) {
    localStorage.setItem('userCountry', countryId);
    localStorage.setItem('userCountryName', countryName);
  }

  /**
   * Get user role from localstorage
   *
   * @returns user role
   * */
  getUserCountryFromLocal(): string {
    const country = localStorage.getItem('userCountry');
    return country ? country : null;
  }
}
