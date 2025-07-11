import { Component, OnInit } from '@angular/core';
import { RfidService } from 'src/app/services/rfid.service';
import { RFIDRegistro } from 'src/app/MODELS/rfid-registro.models';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from 'src/app/components/edit-dialog/edit-dialog.component';


@Component({
  selector: 'app-rfid',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.scss'],
})
export class RfidComponent implements OnInit {
  registros: RFIDRegistro[] = [];
  nuevoRegistro: RFIDRegistro = {
    idRegistro: '',
    idAccesos: false,
    nombre: '',
    fecha: '',
  };

  editando: boolean = false;

  constructor(private rfidService: RfidService,
  private notify: NotificationService,
  private dialog: MatDialog) {}

  ngOnInit(): void {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.rfidService.getRegistros().subscribe((data) => {
      this.registros = data;
    });
  }

  onRFIDScanned() {
    if (this.nuevoRegistro.idRegistro && this.nuevoRegistro.idRegistro.length >= 8) {
      const body: RFIDRegistro = {
        idRegistro: this.nuevoRegistro.idRegistro,
        idAccesos: this.nuevoRegistro.idAccesos,
      };

      this.rfidService.postRegistro(body).subscribe({
        next: (response) => {
          this.notify.showSuccess(`¡Bienvenido ${response.nombre}!`);
          this.limpiarFormulario();
          this.cargarRegistros();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.notify.showError('⚠️ Error al guardar. Verifica que el RFID esté registrado.');
        }
      });
    }
  }

  enviarRegistro() {
    const registroFormateado: RFIDRegistro = {
      ...this.nuevoRegistro,
      fecha: this.formatDate(this.nuevoRegistro.fecha || ''),
    };

    if (this.editando) {
      this.rfidService.putRegistro(registroFormateado).subscribe(() => {
        this.notify.showSuccess('Registro actualizado');
        this.limpiarFormulario();
        this.cargarRegistros();
      });
    } else {
      this.rfidService.postRegistro(registroFormateado).subscribe(() => {
        this.notify.showSuccess('Registro guardado');
        this.limpiarFormulario();
        this.cargarRegistros();
      });
    }
  }

  async eliminarRegistro(idRegistro: string) {
    const confirmado = await this.notify.confirm('¿Seguro que quieres eliminar este registro?');
    if (confirmado) {
      this.rfidService.deleteRegistro(idRegistro).subscribe(() => {
        this.notify.showSuccess('Registro eliminado');
        this.cargarRegistros();
      });
    }
  }


  limpiarFormulario() {
    this.nuevoRegistro = {
      idRegistro: '',
      idAccesos: false,
      nombre: '',
      fecha: '',
    };
    this.editando = false;
  }
editarRegistro(registro: RFIDRegistro) {
  const dialogRef = this.dialog.open(EditDialogComponent, {
    width: '400px',
    data: registro,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.rfidService.putRegistro(result).subscribe(() => {
        this.notify.showSuccess('Registro actualizado');
        this.cargarRegistros();
      });
    }
  });
}


  formatDate(date?: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString();
  }
}
