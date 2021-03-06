import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ITipoPregunta} from './tipo-pregunta';
import {AppSettings} from '../global';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class TipoPreguntaService {

  private baseUrl = 'tipoPregunta/tipos';

  constructor(private http: HttpClient) {
  }

  getTipoPreguntas(): Observable<ITipoPregunta[]> {
    return this.http
      .get<ITipoPregunta[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}`)
      // .do(data => console.log('All : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  getTipoPregunta(id: number): Observable<ITipoPregunta> {
    if (id === 0) {
      return Observable.of(this.initializeTipoPregunta());
    }
    return this.http
      .get<ITipoPregunta>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => console.log('getTipoPregunta : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  saveTipoPregunta(tipoPregunta: ITipoPregunta): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    if (tipoPregunta.tipoPreguntaId === 0) {
      return this.createTipoPregunta(tipoPregunta, {headers: headers, responseType: 'text'});
    }
    return this.updateTipoPregunta(tipoPregunta, {headers: headers, responseType: 'text'});
  }

  private createTipoPregunta(tipoPregunta: ITipoPregunta, options: {}): Observable<any> {
    tipoPregunta.tipoPreguntaId = undefined;
    tipoPregunta.creadoPor = 2;
    tipoPregunta.creadoEn = Date.now().toString();
    tipoPregunta.modifPor = 0;
    tipoPregunta.modifEn = null;
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, tipoPregunta, options)
      .do(data => {
        console.log('createTipoPregunta:');
        return data;
      })
      .catch(this.errorHandler);
  }

  deleteTipoPregunta(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`;
    return this.http.delete(url, {responseType: 'json'})
      .do(data => console.log('deleteTipoPregunta'))
      .catch(this.errorHandler);
  }

  private updateTipoPregunta(tipoPregunta: ITipoPregunta, options: {}): Observable<any> {
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/`;
    return this.http.put(url, tipoPregunta, options)
      .do(data => {
        console.log('updateTipoPregunta:');
        return data;
      })
      .catch(this.errorHandler);
  }

  private errorHandler(error: HttpErrorResponse) {
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

  initializeTipoPregunta(): ITipoPregunta {
    return {
      tipoPreguntaId: 0,
      descripcion: null
    };
  }

}
