import {IRespuesta} from "./respuesta";

export interface IPregunta {
  grupoPregun?: number;
  tipoPregun?: number;
  creadoPor?: number;
  modifPor?: number;
  textoPregunta?: number;
  dependencia?: number;
  preguntaId: number;
  descripcion: string;
  estado: string;
  creadoEn?: string;
  modifEn?: string;
  opciones?: IRespuesta[];
}
