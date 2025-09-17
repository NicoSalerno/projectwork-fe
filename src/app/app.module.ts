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
import { logoutInterceptor } from './utils/logout.interceptor';
import { RegisterComponent } from './pages/register/register.component';
import { SeeUsersComponent } from './pages/see-users/see-users.component';

@NgModule({
  declarations: [
    AppComponent,
    SeeUsersComponent,
    IfAuthenticatedDirective,
    HomePageComponent,
    SidePanelComponent,
    NavBarComponent,
    NavUserComponent,
    RegisterComponent,
    LoginComponent
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
