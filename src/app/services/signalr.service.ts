import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  conectar(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(
        'https://api-rfid-dxc7ajbaf3encafu.canadacentral-01.azurewebsites.net/hub/notificaciones', 
        { withCredentials: true } // <-- Aquí es clave para CORS con credenciales
      )
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR conectado'))
      .catch(err => {
        console.error('❌ Error al conectar SignalR:', err);
        // Puedes agregar reconexión manual si quieres, pero withAutomaticReconnect ya lo hace
      });
  }

  onActualizar(callback: (mensaje: string) => void): void {
    if (!this.hubConnection) {
      console.error('SignalR no está conectado');
      return;
    }

    this.hubConnection.on('RecibirActualizacion', callback);
  }
}
