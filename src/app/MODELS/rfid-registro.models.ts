
export interface RFIDRegistro {
  idRegistro: string;
  idAccesos: boolean;
  nombre?: string;
  fecha?: string;
}
export interface RFIDUsuario {
  idUsuario?: number;
  nombre: string;
  rol: 'Supervisor' | 'Empleado' | 'Visita' | 'Externo';
  idTarjeta: string;
}