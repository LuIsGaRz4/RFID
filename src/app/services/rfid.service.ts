import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RFIDRegistro } from '../MODELS/rfid-registro.models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RFIDUsuario } from '../MODELS/rfid-registro.models';

@Injectable({
  providedIn: 'root',
})
export class RfidService {
  private baseUrl = 'https://localhost:7188/api/RFIDRegistro';

  constructor(private http: HttpClient) {}

  // Obtener registros (GET)
  getRegistros(): Observable<RFIDRegistro[]> {
    return this.http.get<RFIDRegistro[]>(`${this.baseUrl}/MostrarTodoRegistro`);
  }

  // Crear nuevo registro (POST)
  postRegistro(data: RFIDRegistro): Observable<RFIDRegistro> {
    return this.http.post<RFIDRegistro>(`${this.baseUrl}/AgregarRegistro`, data);
  }

  // Actualizar registro (PUT), con header idTarjeta
  putRegistro(data: RFIDRegistro, idTarjeta: string) {
    const headers = new HttpHeaders({ idTarjeta });
    return this.http.put(`${this.baseUrl}/Actualizarregistro`, data, { headers });
  }

  // Eliminar registro (DELETE), con header idTarjeta
  deleteRegistro(id: string, idTarjeta: string) {
    const headers = new HttpHeaders({ idTarjeta });
    return this.http.delete(`${this.baseUrl}/BorrarRegistro/${id}`, { headers });
  }

  // Obtener rol por tarjeta (GET)
  getRolPorTarjeta(idTarjeta: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/rolPorTarjeta/${idTarjeta}`);
  }
  // ✅ Agregar nueva tarjeta
agregarTarjeta(tarjeta: { idTarjeta: string; nombre: string }) {
  return this.http.post(`${this.baseUrl}/AgregarTarjetas`, tarjeta);
}
getTarjetas(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/MostrarTodasLasTarjetas`);
}

  deleteCard(cardId: string): Observable<string> {
    const idTarjetaSolicitante = localStorage.getItem('idTarjeta') || '';
    const headers = new HttpHeaders({ idTarjeta: idTarjetaSolicitante });
    return this.http.delete(
      `${this.baseUrl}/BorrarTarjeta/${cardId}`, 
      { headers, responseType: 'text' }
    );
  }



getUsuarios(): Observable<RFIDUsuario[]> {
  return this.http.get<RFIDUsuario[]>(`${this.baseUrl}/MostrarTarjetas`);
}



agregarUsuario(usuario: RFIDUsuario): Observable<RFIDUsuario> {
  return this.http.post<RFIDUsuario>(`${this.baseUrl}/Agregar`, usuario);
}


  actualizarUsuario(usuario: RFIDUsuario): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ActualizarPorTarjeta/${usuario.idTarjeta}`,usuario);
  }

  deleteUsuarioPorTarjeta(idTarjeta: string) {
    return this.http.delete(`${this.baseUrl}/EliminarPorTarjeta/${idTarjeta}`);
  }

}
