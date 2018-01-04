import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {IPregunta} from "./pregunta";
import {AppSettings} from "../global";


@Injectable()
export class PreguntaService {

  private baseUrl = 'pregunta/preguntas';

  constructor(private http: HttpClient) {
  }

  getPreguntas(): Observable<IPregunta[]> {
    return this.http
      .get<IPregunta[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}`)
      // .do(data => console.log('All : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  getPregunta(id: number): Observable<IPregunta> {
    if (id === 0) {
      return Observable.of(this.initializePregunta());
    }
    return this.http
      .get<IPregunta>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => console.log('getPregunta : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  savePregunta(pregunta: IPregunta): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    if (pregunta.preguntaId === 0) {
      return this.createPregunta(pregunta, {headers: headers});
    }
    return this.updatePregunta(pregunta, {headers: headers, responseType: 'text'});
  }

  private createPregunta(pregunta: IPregunta, options: {}): Observable<any> {
    pregunta.preguntaId = undefined;
    pregunta.creadoPor = 2;
    pregunta.creadoEn = Date.now().toString();
    pregunta.modifPor = 0;
    pregunta.modifEn = null;
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, pregunta, options)
      .do(data => {
        console.log('CreatePregunta:');
        return data;
      })
      .catch(this.errorHandler);
  }

  deletePregunta(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`;
    return this.http.delete(url, {responseType: 'json'})
      .do(data => console.log('deletePregunta'))
      .catch(this.errorHandler);
  }

  private updatePregunta(pregunta: IPregunta, options: {}): Observable<IPregunta> {
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/`;
    return this.http.put(url, pregunta, options)
      .map(() => pregunta)
      .do(data => {
        console.log('updatePregunta:');
        return data;
      })
      .catch(this.errorHandler);
  }

  private errorHandler(error: HttpErrorResponse) {
    // console.error(error);
    let errorMessage = '';
    if (error.error instanceof HttpErrorResponse) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = error.error.message;
    }
    return Observable.throw(errorMessage);
  }

  initializePregunta(): IPregunta {
    return {
      preguntaId: 0,
      descripcion: '',
      dependencia: null,
      grupoPregun: null,
      estado: 'A',
      tipoPregun: null
    };
  }
}
