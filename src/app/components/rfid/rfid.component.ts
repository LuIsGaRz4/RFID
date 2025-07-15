import { Component, OnInit } from '@angular/core';
import { RfidService } from 'src/app/services/rfid.service';
import { RFIDRegistro, RFIDUsuario } from 'src/app/MODELS/rfid-registro.models';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from 'src/app/components/edit-dialog/edit-dialog.component';
import { AuthService } from '../auth/auth.service';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RfidManualComponent } from '../rfid-manual/rfid-manual.component';
import { RfidEliminarTarjetaComponent } from '../rfid-eliminar-tarjeta/rfid-eliminar-tarjeta.component';
import { UsuariosListaComponent } from '../rfid-usuarios/usuario-lista/usuario-lista.component';
import { SignalRService } from 'src/app/services/signalr.service';



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

constructor(
  private rfidService: RfidService,
  private notify: NotificationService,
  private dialog: MatDialog,
  public auth: AuthService,
  private signalR: SignalRService // ⬅️ nuevo
) {}


ngOnInit(): void {
  this.cargarRegistros();

  this.signalR.conectar();
  this.signalR.onActualizar(() => {
    this.cargarRegistros();
    this.notify.showSuccess('🔄 Registros actualizados automáticamente');
  });
}


exportarExcel() {
  const data = this.registros.map(reg => ({
    'ID Registro': reg.idRegistro,
    'Acceso': reg.idAccesos ? 'Sí' : 'No',
    'Nombre': reg.nombre,
    'Fecha': reg.fecha ? new Date(reg.fecha).toLocaleString() : '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  FileSaver.saveAs(blob, 'Reporte_Accesos.xlsx');
}

exportarPDF() {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Reporte de Accesos RFID', 14, 20);

  const tableData = this.registros.map((reg) => [
    reg.idRegistro ?? '',
    reg.idAccesos ? 'Sí' : 'No',
    reg.nombre ?? '',
    reg.fecha ? new Date(reg.fecha).toLocaleString() : '',
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['ID Registro', 'Acceso', 'Nombre', 'Fecha']],
    body: tableData as string[][], // forzamos el tipo para evitar conflicto con undefined
  });

  doc.save('Reporte_Accesos.pdf');
}

  abrirLogin() {
  this.dialog.open(LoginDialogComponent, {
    width: '300px',
    disableClose: true,
  });
}

logout() {
  this.auth.logout();
}
get esSupervisor(): boolean {
  return this.auth.isSupervisor();
}


  cargarRegistros() {
    this.rfidService.getRegistros().subscribe((data) => {
      this.registros = data;
    });
  }
  abrirFormularioManual() {
  this.dialog.open(RfidManualComponent, {
    width: '400px',
    disableClose: true,
  });
}
abrirFormularioeliminart() {
  this.dialog.open(RfidEliminarTarjetaComponent, {
    width: '520px',
    disableClose: false,
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

  const idTarjeta = this.auth.getIdTarjeta();
  if (!idTarjeta) {
    this.notify.showError('⚠️ No se detectó la tarjeta del usuario.');
    return;
  }

  if (this.editando) {
    this.rfidService.putRegistro(registroFormateado, idTarjeta).subscribe(() => {
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
    const idTarjeta = this.auth.getIdTarjeta();
    if (!idTarjeta) {
      this.notify.showError('⚠️ No se detectó la tarjeta del usuario.');
      return;
    }

    this.rfidService.deleteRegistro(idRegistro, idTarjeta).subscribe(() => {
      this.notify.showSuccess('Registro eliminado');
      this.cargarRegistros();
    });
  }
}


editarRegistro(registro: RFIDRegistro) {
  const dialogRef = this.dialog.open(EditDialogComponent, {
    width: '400px',
    data: registro,
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const idTarjeta = this.auth.getIdTarjeta();
      if (!idTarjeta) {
        this.notify.showError('⚠️ No se detectó la tarjeta del usuario.');
        return;
      }

      this.rfidService.putRegistro(result, idTarjeta).subscribe(() => {
        this.notify.showSuccess('Registro actualizado');
        this.cargarRegistros();
      });
    }
  });
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

  formatDate(date?: string): string {
    if (!date) return '';
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString();
  }

  isSupervisor(): boolean {
    return this.auth.isSupervisor();
  }

  abrirModal() {
    this.dialog.open(UsuariosListaComponent, {
      width: '600px',
      maxHeight: '80vh',
      disableClose: false,
      panelClass: 'custom-dialog-container' // opcional, para estilos
    });
  }
}
