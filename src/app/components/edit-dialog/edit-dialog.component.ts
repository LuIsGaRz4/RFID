import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RFIDRegistro } from 'src/app/MODELS/rfid-registro.models';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent {
  formData: RFIDRegistro;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RFIDRegistro
  ) {
    this.formData = { ...data }; // clonar los datos
  }

  save() {
    this.dialogRef.close(this.formData);
  }

  cancel() {
    this.dialogRef.close();
  }
}
