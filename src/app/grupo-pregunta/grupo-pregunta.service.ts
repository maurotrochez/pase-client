import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {IGrupoPregunta} from "./grupo-pregunta";
import {AppSettings} from "../global";

@Injectable()
export class GrupoPreguntaService {

  private baseUrl = 'grupos';

  constructor(private http: HttpClient) {
  }

  getGrupoPreguntas(): Observable<IGrupoPregunta[]> {
    return this.http
      .get<IGrupoPregunta[]>(`${AppSettings.API_ENDPOINT}${this.baseUrl}`)
      // .do(data => console.log('All : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  getGrupoPregunta(id: number): Observable<IGrupoPregunta> {
    if (id === 0) {
      return Observable.of(this.initializeGrupoPregunta());
    }
    return this.http
      .get<IGrupoPregunta>(`${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`)
      .do(data => console.log('getGrupoPreguntaa : ' + JSON.stringify(data)))
      .catch(this.errorHandler);
  }

  saveGrupoPregunta(grupoPregunta: IGrupoPregunta): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    if (grupoPregunta.grupoPreguntaId === 0) {
      return this.createGrupoPregunta(grupoPregunta, {headers: headers});
    }
    return this.updateGrupoPregunta(grupoPregunta, {headers: headers, responseType: 'text'});
  }

  private createGrupoPregunta(grupoPregunta: IGrupoPregunta, options: {}): Observable<any> {
    grupoPregunta.grupoPreguntaId = undefined;
    grupoPregunta.creadoPor = 2;
    grupoPregunta.creadoEn = Date.now().toString();
    grupoPregunta.modifPor = 0;
    grupoPregunta.modifEn = null;
    return this.http.post(`${AppSettings.API_ENDPOINT}${this.baseUrl}`, grupoPregunta, options)
      .do(data => console.log('createGrupoPregunta:'))
      .catch(this.errorHandler);
  }

  deleteGrupoPregunta(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/${id}`;
    return this.http.delete(url, {responseType: 'text'})
      .do(data => console.log('deleteGrupoPregunta'))
      .catch(this.errorHandler);
  }

  private updateGrupoPregunta(grupoPregunta: IGrupoPregunta, options: {}): Observable<IGrupoPregunta> {
    const url = `${AppSettings.API_ENDPOINT}${this.baseUrl}/`;
    return this.http.put(url, grupoPregunta, options)
      .map(() => grupoPregunta)
      .do(data => console.log('updateGrupoPregunta: ' + JSON.stringify(data)))
      .catch(this.errorHandler);
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

  initializeGrupoPregunta(): IGrupoPregunta {
    return {
      grupoPreguntaId: 0,
      descripcion: null
    };
  }

}
