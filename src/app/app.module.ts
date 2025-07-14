import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditDialogComponent } from './components/edit-dialog/edit-dialog.component';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { RfidManualComponent } from './components/rfid-manual/rfid-manual.component';
import { RfidEliminarTarjetaComponent } from './components/rfid-eliminar-tarjeta/rfid-eliminar-tarjeta.component';
import { RfidUsuariosComponent } from './components/rfid-usuarios/rfid-usuarios.component';
import { UsuarioModalComponent } from './components/rfid-usuarios/usuario-modal/usuario-modal.component';
import { UsuariosListaComponent } from './components/rfid-usuarios/usuario-lista/usuario-lista.component';

@NgModule({
  declarations: [AppComponent, RfidComponent, ConfirmDialogComponent, EditDialogComponent, LoginDialogComponent, RfidManualComponent, RfidEliminarTarjetaComponent, RfidUsuariosComponent, UsuarioModalComponent,UsuariosListaComponent],
  imports: [FormsModule,BrowserAnimationsModule,BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule,MatSnackBarModule,MatDialogModule],
  entryComponents: [ConfirmDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
