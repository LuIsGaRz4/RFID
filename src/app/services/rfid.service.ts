import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RFIDRegistro } from '../MODELS/rfid-registro.models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RfidService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ Obtener registros
  getRegistros(): Observable<RFIDRegistro[]> {
    return this.http.get<RFIDRegistro[]>(this.apiUrl);
  }

  // ✅ Crear nuevo registro
  postRegistro(data: RFIDRegistro): Observable<RFIDRegistro> {
    return this.http.post<RFIDRegistro>(this.apiUrl, data);
  }

  // ✅ Actualizar registro (PUT)
  putRegistro(data: RFIDRegistro): Observable<RFIDRegistro> {
    return this.http.put<RFIDRegistro>(this.apiUrl, data);
  }

  // ✅ Eliminar registro (DELETE)
  deleteRegistro(idRegistro: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idRegistro}`);
  }

getRolPorTarjeta(idTarjeta: string): Observable<string> {
  return this.http.get<string>(`https://localhost:7188/api/Usuarios/rol/${idTarjeta}`);
}



  
}