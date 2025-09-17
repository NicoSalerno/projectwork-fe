import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-telephone-top-up',
  standalone: false,
  templateUrl: './telephone-top-up.component.html',
  styleUrl: './telephone-top-up.component.css'
})
export class TelephoneTopUpComponent {
  protected fb = inject(FormBuilder);
  protected authSrv = inject(AuthService);
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);

    telephoneForm = this.fb.group({
    operatore: ['', Validators.required],
    importo: ['', Validators.required]
  });
  topUp(){

  }
}
