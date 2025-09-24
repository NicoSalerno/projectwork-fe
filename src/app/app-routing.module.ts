import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { SeeUsersComponent } from './pages/see-users/see-users.component';
import { TelephoneTopUpComponent } from './pages/telephone-top-up/telephone-top-up.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DetailsComponent } from './pages/details/details.component';
import { WireTransferComponent } from './pages/wire-transfer/wire-transfer.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'homepage',
    component: HomePageComponent,
  },
  {
    path:'seeUsers',
    component: SeeUsersComponent
  },
  {
    path:'telephone-top-up',
    component: TelephoneTopUpComponent
  },
  {
    path:'settings',
    component:SettingsComponent
  },
  {
    path:'details/:id',
    component: DetailsComponent
  },
  {
    path:'wire-transfer',
    component: WireTransferComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
