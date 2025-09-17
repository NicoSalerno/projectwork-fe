import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';
import { IfAuthenticatedDirective } from './utils/if-authenticated.directive';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavUserComponent } from './components/nav-user/nav-user.component';
import { IfTeacherDirective } from './utils/if-teacher.directive';
import { CreateClassComponent } from './pages/create-class/create-class.component';
import { logoutInterceptor } from './utils/logout.interceptor';
import { ShowClassComponent } from './pages/show-class/show-class.component';
import { SetAssignmentComponent } from './pages/set-assignment/set-assignment.component';
import { SeeAssignmentComponent } from './pages/see-assignment/see-assignment.component';
import { IfStudentDirective } from './utils/if-student.directive';
import { RegisterComponent } from './pages/register/register.component';
import { SeeUsersComponent } from './pages/see-users/see-users.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IfAuthenticatedDirective,
    HomePageComponent,
    SidePanelComponent,
    NavBarComponent,
    NavUserComponent,
    IfTeacherDirective,
    CreateClassComponent,
    ShowClassComponent,
    SetAssignmentComponent,
    SeeAssignmentComponent,
    IfStudentDirective,
    RegisterComponent,
    SeeUsersComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, logoutInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
