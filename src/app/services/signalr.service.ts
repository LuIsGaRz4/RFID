import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  conectar(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://api-rfid-dxc7ajbaf3encafu.canadacentral-01.azurewebsites.net/hub/notificaciones')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ SignalR conectado'))
      .catch(err => console.error('❌ Error al conectar SignalR:', err));
  }

  onActualizar(callback: (mensaje: string) => void): void {
    this.hubConnection?.on('RecibirActualizacion', callback);
  }
}
