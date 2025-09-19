import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { BankService } from '../../services/bank.service';
import { ContoCorrente } from '../../entities/user.entity';
import { filter, map, switchMap, Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  protected authSrv = inject(AuthService);
  private dialog = inject(MatDialog);
  protected bankSrv = inject(BankService);

  currentUser$ = this.authSrv.currentUser$;
  contoCorrente$!: Observable<ContoCorrente>;

  ngOnInit(): void {
    // Recupero il conto corrente basandomi sul contoCorrenteId dell'utente
    this.contoCorrente$ = this.currentUser$.pipe(
      filter((user): user is User => !!user?.contoCorrenteId),
      switchMap(user => this.bankSrv.getContoCorrenteById(user.contoCorrenteId))
    );
  }

  openChangePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Password aggiornata:', result);
      }
    });
  }
}
