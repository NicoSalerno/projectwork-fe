import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CreateClassComponent } from './pages/create-class/create-class.component';
import { ShowClassComponent } from './pages/show-class/show-class.component';
import { SetAssignmentComponent } from './pages/set-assignment/set-assignment.component';
import { SeeAssignmentComponent } from './pages/see-assignment/see-assignment.component';
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
  },
  {
    path: 'createClass',
    component: CreateClassComponent,
  },
  {
    path: 'showClasses',
    component: ShowClassComponent,
  },
  {
    path:'setAssignment',
    component:SetAssignmentComponent
  },
  {
    path:'seeAssignment',
    component:SeeAssignmentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
