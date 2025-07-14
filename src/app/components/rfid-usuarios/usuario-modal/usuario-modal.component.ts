import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RFIDUsuario } from 'src/app/MODELS/rfid-registro.models';
import { RfidService } from 'src/app/services/rfid.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrls: ['./usuario-modal.component.scss']
})
export class UsuarioModalComponent {
  usuario: RFIDUsuario;

  constructor(
    private rfidService: RfidService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<UsuarioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RFIDUsuario | null
  ) {
    // Si hay datos se asume edición, sino creación
    this.usuario = data
      ? { ...data }
      : { idUsuario: 0, nombre: '', rol: 'Empleado', idTarjeta: '' }; // rol con valor válido
  }

guardarCambios() {
  // Validaciones básicas
  if (!this.usuario.nombre?.trim() || !this.usuario.rol || !this.usuario.idTarjeta?.trim()) {
    this.notify.showError('Por favor, complete todos los campos obligatorios.');
    return;
  }

  if (this.usuario.idUsuario && this.usuario.idUsuario !== 0) {
    // Actualizar
    this.rfidService.actualizarUsuario(this.usuario).subscribe({
      next: (usuarioActualizado) => {
        this.notify.showSuccess('Usuario actualizado correctamente.');
        this.dialogRef.close(usuarioActualizado); // Devuelve el usuario actualizado
      },
      error: () => {
        this.notify.showError('Error al actualizar usuario.');
      }
    });
  } else {
    // Agregar
    this.rfidService.agregarUsuario(this.usuario).subscribe({
      next: (nuevoUsuario) => {
        this.notify.showSuccess('Usuario agregado correctamente.');
        this.dialogRef.close(nuevoUsuario); // Devuelve el nuevo usuario agregado
      },
      error: () => {
        this.notify.showError('Error al agregar usuario.');
      }
    });
  }
}



  cancelar() {
    this.dialogRef.close(false);
  }

  // Si prefieres tener cerrar()
  cerrar() {
    this.cancelar();
  }
}
