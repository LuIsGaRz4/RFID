import { Component, OnInit } from '@angular/core';
import { RfidService } from '../../../services/rfid.service';
import { RFIDUsuario } from 'src/app/MODELS/rfid-registro.models';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioModalComponent } from '../usuario-modal/usuario-modal.component';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuario-lista.component.html',
  styleUrls: ['./usuario-lista.component.scss']
})
export class UsuariosListaComponent implements OnInit {
  usuarios: RFIDUsuario[] = [];
  cargando = false;

  constructor(private rfidService: RfidService, private dialog: MatDialog,private notify: NotificationService,private dialogRef: MatDialogRef<UsuariosListaComponent>) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.rfidService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

abrirModal(usuario?: RFIDUsuario) {
  const dialogRef = this.dialog.open(UsuarioModalComponent, {
    width: '400px',
    data: usuario ? { ...usuario } : null,
  });

  dialogRef.afterClosed().subscribe((resultado: RFIDUsuario | undefined) => {
    if (resultado) {
      this.cargarUsuarios(); // refresca la lista de usuarios cuando cierras el modal con éxito
    }
  });
}


actualizarUsuario(usuario: any) {
  const dialogRef = this.dialog.open(UsuarioModalComponent, {
    width: '400px',
    data: usuario
  });

  dialogRef.afterClosed().subscribe((actualizado) => {
    if (actualizado) {
      this.obtenerUsuarios(); // o como recargues la lista
    }
  });
}
obtenerUsuarios() {
  this.rfidService.getUsuarios().subscribe({
    next: (data) => {
      this.usuarios = data;
    },
    error: () => {
      this.notify.showError('❌ Error al cargar usuarios');
    }
  });
}
  

eliminarUsuarioPorTarjeta(idTarjeta: string) {
  if (confirm('¿Seguro que quieres eliminar este usuario?')) {
    this.rfidService.deleteUsuarioPorTarjeta(idTarjeta).subscribe({
      next: () => {
        this.notify.showSuccess('Usuario eliminado correctamente');
        this.cargarUsuarios();
      },
      error: (error) => {
        this.notify.showError('Error al eliminar usuario');
        console.error(error);
      }
    });
  }
}

abrirModalAgregar() {
  const dialogRef = this.dialog.open(UsuarioModalComponent, {
    width: '400px',
    data: null
  });

  dialogRef.afterClosed().subscribe((nuevoUsuario: RFIDUsuario) => {
    if (nuevoUsuario) {
      this.agregarUsuario(nuevoUsuario);
    }
  });
}

  agregarUsuario(usuario: RFIDUsuario) {
    console.log('Agregando usuario:', usuario);
  this.rfidService.agregarUsuario(usuario).subscribe({
    next: () => {
      console.log('Éxito: usuario agregado');
      this.notify.showSuccess('Usuario agregado correctamente');
      this.cargarUsuarios();
    }
  });

    this.cargarUsuarios();
  }


    cerrarModal() {
    this.dialogRef.close();
  }
}

