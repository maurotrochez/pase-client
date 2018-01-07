import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {IRespuesta} from "./respuesta";
import {Observable} from "rxjs/Observable";
import {AppSettings} from "../global";
import {v4 as uuid} from 'uuid';

@Injectable()
export class RespuestaPreguntaService {

  private baseUrl = 'respuestaPregunta/respuestaPreguntas';

  constructor(private http: HttpClient) {
  }

  saveRespuestaPreguntas(respuestas: IRespuesta[]): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const respuestasP: IRespuesta[] = [];
    respuestas.forEach((x) => {
      respuestasP.push(this.createRespuesta(x));
    });
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, respuestasP, {
      headers: headers,
      responseType: 'text'
    })
      .do(data => {
        console.log('CreateRespuestaPregunta:');
        return data;
      })
      .catch(this.errorHandler);
  }

  getRespuestaPreguntasByPreguntaId(id: number): Observable<any> {
    return this.http
      .get<IRespuesta[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => {
        data.forEach(x => {
          x.id = uuid();
          x.clave = Boolean(x.clave);
        });
        console.log('getRespuestas : ' + JSON.stringify(data));
      })
      .catch(this.errorHandler);
  }

  private createRespuesta(respuesta: IRespuesta): IRespuesta {
    // respuesta.preguntaId = undefined;
    respuesta.creadoPor = 2;
    respuesta.creadoEn = Date.now().toString();
    respuesta.modifPor = 0;
    respuesta.modifEn = null;
    return respuesta;
  }

  private errorHandler(error: HttpErrorResponse) {
    console.error(error);
    let errorMessage = '';
    if (error.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
