import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  protected authSrv = inject(AuthService);
  private dialog = inject(MatDialog);

  currentUser$ = this.authSrv.currentUser$;
  currentUser?: User;

  ngOnInit(): void {
    this.currentUser$.subscribe(user => {
      this.currentUser = user ?? undefined;
    });
  }

  openChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Password aggiornata:', result);
        // qui puoi chiamare il tuo AuthService per aggiornare lato server
      }
    });
  }
}
