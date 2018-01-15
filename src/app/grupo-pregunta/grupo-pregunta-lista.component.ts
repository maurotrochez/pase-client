import {Component, OnInit} from '@angular/core';
import {IGrupoPregunta} from './grupo-pregunta';
import {GrupoPreguntaService} from './grupo-pregunta.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private servicioGrupoPregunta: GrupoPreguntaService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.servicioGrupoPregunta.getGrupoPreguntas().subscribe(
      data => {
        this.grupoPreguntas = data;
      }, error2 => this.errorMessage = error2
    );
  }

  ver(modal) {
    this.modalService.open(modal);
  }
}
