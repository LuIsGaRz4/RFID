import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent {
  idTarjeta: string = '';
  error: string = '';

  readonly TARJETA_LENGTH = 10; // Ajusta según longitud real de tus tarjetas

  constructor(
    private auth: AuthService,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) {}

  onInputChange() {
    // Si el input alcanza la longitud esperada, lanza login automáticamente
    if (this.idTarjeta.trim().length === this.TARJETA_LENGTH) {
      this.login();
    }
  }

  login() {
    if (!this.idTarjeta.trim()) {
      this.error = 'Por favor, escanea tu tarjeta';
      return;
    }
    this.error = '';
    this.auth.login(this.idTarjeta.trim()).subscribe({
      next: (res) => {
        this.auth.saveSession(this.idTarjeta.trim(), res.nombre, res.rol);
        this.dialogRef.close(true);
      },
      error: () => {
        this.error = '⚠️ Tarjeta no válida';
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
