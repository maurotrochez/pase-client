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
    const options = {headers: headers, responseType: 'text'};
    if (respuestas.some(x => x.respuestaPreguntaId !== undefined)) {
      return this.updateRespuestaPreguntas(respuestas, options);
    }
    return this.createRespuesta(respuestas, options);

  }

  updateRespuestaPreguntas(respuestas: IRespuesta[], options: {}): Observable<any> {
    const respuestasP: IRespuesta[] = [];
    respuestas.forEach(r => {
      if (r.respuestaPreguntaId === undefined) {
        r.creadoPor = 2;
        r.creadoEn = Date.now().toString();
        r.modifPor = 0;
        r.modifEn = null;
      }
    });
    return this.http.put(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, respuestas, options)
      .do(data => {
        console.log('UpdateRespuestaPregunta:');
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

  private createRespuesta(respuestas: IRespuesta[], options: {}): Observable<any> {
    // respuesta.preguntaId = undefined;
    const respuestasP: IRespuesta[] = [];
    respuestas.forEach((x) => {
      x.creadoPor = 2;
      x.creadoEn = Date.now().toString();
      x.modifPor = 0;
      x.modifEn = null;
      respuestasP.push(x);
    });

    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, respuestasP, options)
      .do(data => {
        console.log('CreateRespuestaPregunta:');
        return data;
      })
      .catch(this.errorHandler);

    // return respuesta;
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
