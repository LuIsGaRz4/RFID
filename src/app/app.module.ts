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

@NgModule({
  declarations: [AppComponent, RfidComponent, ConfirmDialogComponent, EditDialogComponent],
  imports: [FormsModule,BrowserAnimationsModule,BrowserModule, FormsModule, HttpClientModule, BrowserAnimationsModule,MatSnackBarModule,MatDialogModule],
  entryComponents: [ConfirmDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
