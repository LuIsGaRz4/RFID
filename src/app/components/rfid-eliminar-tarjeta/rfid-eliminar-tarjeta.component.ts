import { Component, OnInit } from '@angular/core';
import { RfidService } from 'src/app/services/rfid.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rfid-eliminar-tarjeta',
  templateUrl: './rfid-eliminar-tarjeta.component.html',
  styleUrls: ['./rfid-eliminar-tarjeta.component.scss']
})
export class RfidEliminarTarjetaComponent implements OnInit {
  tarjetas: any[] = [];
  cargando = false;

  constructor(
    private rfidService: RfidService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<RfidEliminarTarjetaComponent>
  ) {}

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas() {
    this.cargando = true;
    this.rfidService.getTarjetas().subscribe({
      next: (data) => {
        this.tarjetas = data;
        this.cargando = false;
      },
      error: () => {
        this.notify.showError('Error cargando tarjetas');
        this.cargando = false;
      }
    });
  }

eliminarTarjeta(idTarjetaEliminar: string) {
  this.rfidService.deleteCard(idTarjetaEliminar).subscribe({
    next: () => {
      this.notify.showSuccess('Tarjeta eliminada correctamente');
      this.cargarTarjetas(); // refresca la lista si quieres
    },
    error: (error) => {
      this.notify.showError('Error al eliminar tarjeta');
      console.error(error);
    }
  });
}

    cerrar() {
    this.dialogRef.close();
  }
}
