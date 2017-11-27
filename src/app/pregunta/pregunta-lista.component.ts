import {Component, OnInit} from '@angular/core';
import {IPregunta} from './pregunta';
import {PreguntaService} from "./pregunta.service";

@Component({
  // selector: 'app-pregunta-lista',
  templateUrl: './pregunta-lista.component.html',
  styleUrls: ['./pregunta-lista.component.css']
})
export class PreguntaListaComponent implements OnInit {
  pageTitle = 'Listado de preguntas';
  filtroPregunta: string;
  errorMessage: string;
  preguntas: IPregunta[];

  constructor(private servicioPregunta: PreguntaService) {
  }

  ngOnInit() {
    this.servicioPregunta.getPreguntas().subscribe(
      data => {
        // console.log(data);
        this.preguntas = data;
      }, error => this.errorMessage = error
    );
  }

}
