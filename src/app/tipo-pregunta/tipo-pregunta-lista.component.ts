import {Component, OnInit} from '@angular/core';
import {TipoPreguntaService} from "./tipo-pregunta.service";
import {ITipoPregunta} from "./tipo-pregunta";

@Component({
  selector: 'app-tipo-pregunta-lista',
  templateUrl: './tipo-pregunta-lista.component.html',
  styleUrls: ['./tipo-pregunta-lista.component.css']
})
export class TipoPreguntaListaComponent implements OnInit {
  pageTitle = 'Listado de tipos de preguntas';
  filtroTipoPregunta: string;
  errorMessage: string;
  tipoPreguntas: ITipoPregunta[];

  constructor(private servicioTipoPregunta: TipoPreguntaService) {
  }

  ngOnInit() {
    this.servicioTipoPregunta.getTipoPreguntas().subscribe(
      data => {
        this.tipoPreguntas = data;
      }, error2 => this.errorMessage = error2
    );
  }

}
