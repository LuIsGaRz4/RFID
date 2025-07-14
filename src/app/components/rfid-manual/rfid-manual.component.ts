import { Component } from '@angular/core';
import { RfidService } from 'src/app/services/rfid.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RFIDRegistro } from 'src/app/MODELS/rfid-registro.models';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rfid-manual',
  templateUrl: './rfid-manual.component.html',
  styleUrls: ['./rfid-manual.component.scss']
})
export class RfidManualComponent {
  nuevoRegistro: RFIDRegistro = {
    idRegistro: '',
    idAccesos: false,
    nombre: '',
    fecha: ''
  };

  constructor(
    private rfidService: RfidService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<RfidManualComponent>
  ) {}

nuevaTarjeta = {
  idTarjeta: '',
  nombre: ''
};

guardarTarjetaManual() {
  if (!this.nuevaTarjeta.idTarjeta || !this.nuevaTarjeta.nombre) {
    this.notify.showError('Todos los campos son obligatorios');
    return;
  }

  this.rfidService.agregarTarjeta(this.nuevaTarjeta).subscribe({
    next: () => {
      this.notify.showSuccess('✅ Tarjeta guardada exitosamente');
      this.limpiarFormulario();
      this.cerrar();  // <-- Aquí cerramos el modal
    },
    error: () => {
      this.notify.showError('❌ Error al guardar la tarjeta');
    }
  });
}



guardarRegistro() {
  this.rfidService.postRegistro(this.nuevoRegistro).subscribe({
    next: () => {
      this.notify.showSuccess('✅ Registro guardado exitosamente');
      this.limpiarFormulario();
    },
    error: () => {
      this.notify.showError('❌ Error al guardar el registro');
    }
  });
}
  limpiarFormulario() {
    this.nuevoRegistro = {
      idRegistro: '',
      idAccesos: false,
      nombre: '',
      fecha: ''
    };
  }

  cerrar() {
  this.dialogRef.close();
}
}
