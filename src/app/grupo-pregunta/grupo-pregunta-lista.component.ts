import { Component, OnInit } from '@angular/core';
import {IGrupoPregunta} from "./grupo-pregunta";

@Component({
  selector: 'app-grupo-pregunta-lista',
  templateUrl: './grupo-pregunta-lista.component.html',
  styleUrls: ['./grupo-pregunta-lista.component.css']
})
export class GrupoPreguntaListaComponent implements OnInit {

  pageTitle = 'Listado de grupos de preguntas';
  filtroGrupoPregunta: string;
  errorMessage: string;
  grupoPreguntas: IGrupoPregunta[];

  constructor() { }

  ngOnInit() {
  }

}
