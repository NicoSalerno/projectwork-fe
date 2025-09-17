import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { SeeUsersComponent } from './pages/see-users/see-users.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
