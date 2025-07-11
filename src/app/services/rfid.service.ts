import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { RFIDRegistro } from '../MODELS/rfid-registro.models';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RfidService {
  private apiUrl = environment.apiUrl;
  private baseUrl = 'https://localhost:7188/api/RFIDRegistro';


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
  putRegistro(data: RFIDRegistro, idTarjeta: string) {
    return this.http.put(this.baseUrl, data, {
      headers: new HttpHeaders({ idTarjeta })
    });
  }

  deleteRegistro(id: string, idTarjeta: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ idTarjeta })
    });
  }

getRolPorTarjeta(idTarjeta: string): Observable<string> {
  return this.http.get<string>(`https://localhost:7188/api/Usuarios/rol/${idTarjeta}`);
}



  
}