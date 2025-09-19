import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  standalone: false,
  templateUrl: "./change-password.component.html",
  styleUrl: "./change-password.component.css",
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);

  requestedUrl: string | null = null;

  form = this.fb.group({
    oldPassword: ["", [Validators.required, Validators.minLength(8)]],
    newPassword: ["", [Validators.required, Validators.minLength(8)]],
    confirmPassword: ["", [Validators.required, Validators.minLength(8)]],
  });


  changePasswordError = '';

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.form.valid) {
      const { oldPassword, newPassword, confirmPassword } = this.form.value;

      this.authSrv
        .changePassword(oldPassword!, newPassword!, confirmPassword!)
        .pipe(
          catchError((response) => {
            this.changePasswordError = response.error?.error || 'Errore imprevisto';
            return throwError(() => response);
          })
        )
        .subscribe({
          next: () => {
            this.dialogRef.close(this.form.value); // chiudi solo se va a buon fine
          }
        });
    }
  }

}
