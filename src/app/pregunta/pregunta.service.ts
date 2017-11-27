import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
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

  initializePregunta(): IPregunta {
    return {
      preguntaId: 0,
      descripcion: null,
      dependenciaId: null,
      grupoPreguntaId: null,
      estado: null,
      textoId: null,
      tipoPreguntaId: null
    };
  }
}
