import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7188/api/RFIDRegistro'; // ruta API

  constructor(private http: HttpClient) {}

  login(idTarjeta: string) {
    return this.http.get<any>(`${this.baseUrl}/rolPorTarjeta/${idTarjeta}`);
  }

  saveSession(idTarjeta: string, nombre: string, rol: string) {
    localStorage.setItem('idTarjeta', idTarjeta);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('rol', rol);
  }

  getRol() {
    return localStorage.getItem('rol');
  }

  getIdTarjeta() {
    return localStorage.getItem('idTarjeta');
  }

  isSupervisor(): boolean {
    return this.getRol() === 'Supervisor';
  }

  getNombre(): string | null {
    return localStorage.getItem('nombre');
  }

  eliminarTarjeta(idTarjetaEliminar: string) {
    const idTarjetaSolicitante = this.getIdTarjeta();
    if (!idTarjetaSolicitante) {
      throw new Error('No se detectó la tarjeta del usuario');
    }

    const headers = new HttpHeaders({
      idTarjeta: idTarjetaSolicitante
    });

    return this.http.delete(
      `${this.baseUrl}/BorrarTarjeta/${idTarjetaEliminar}`,
      { headers }
    );
  }

  eliminarRegistro(idRegistro: string) {
    const idTarjetaSolicitante = this.getIdTarjeta();
    if (!idTarjetaSolicitante) {
      throw new Error('No se detectó la tarjeta del usuario');
    }

    const headers = new HttpHeaders({
      idTarjeta: idTarjetaSolicitante
    });

    return this.http.delete(
      `${this.baseUrl}/BorrarRegistro/${idRegistro}`,
      { headers }
    );
  }

  logout() {
    localStorage.clear();
  }
}
