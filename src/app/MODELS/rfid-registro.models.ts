
export interface RFIDRegistro {
  id?: number;           // nuevo campo PK
  idRegistro: string;    // la tarjeta que puede repetirse
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