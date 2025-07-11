import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7188/api/RFIDRegistro'; // o la ruta correspondiente

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
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session).nombre : null;
  }

  logout() {
    localStorage.clear();
  }
}
