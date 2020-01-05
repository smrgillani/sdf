import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SelectRoleComponent } from './select-role/select-role.component';
import { IsAuthenticated, HasNoHome } from '../auth/permissions';
import { LogoutComponent } from './logout/logout.component';
import { ForgotComponent } from './forgot/forgot.component';
import { IdSignUpComponent } from './id-sign-up/id-sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PasswordUpdatedComponent } from './password-updated/password-updated.component';
import { TermsOfUseContent } from './terms-of-use/terms-of-use.component';
import { SelectCountryComponent } from './select-country/select-country.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home'
    },
    canActivate: [HasNoHome]
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login'
    },
  },
  {
    path: 'forgot',
    component: ForgotComponent,
    data: {
      title: 'Forgot Password'
    },
  },
  {
    path: 'idsignup',
    component: IdSignUpComponent,
    data: {
      title: 'ID Verification'
    },
  },
  {
    path: 'resetpassword/:uidb64/:token',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password'
    },
  },
  {
    path: 'passwordupdated',
    component: PasswordUpdatedComponent,
    data: {
      title: 'Password Updated'
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'Signup'
    },
  },
  {
    path: 'logout',
    component: LogoutComponent,
  }, {
    path: 'access_token',
    component: LoginComponent
  },
  {
    path: 'role',
    component: SelectRoleComponent,
    data: {
      title: 'Select Role'
    },
    canActivate: [IsAuthenticated]
  }, 
  {
    path: 'country',
    component: SelectCountryComponent,
    data: {
      title: 'Select Country'
    }
  },  
  {
    path: 'block-explorer',
    loadChildren: 'app/block-explore/block-explore.module#BlockExploreModule'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule { }
