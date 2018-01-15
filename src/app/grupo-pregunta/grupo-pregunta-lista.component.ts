import {Component, OnInit} from '@angular/core';
import {IGrupoPregunta} from './grupo-pregunta';
import {GrupoPreguntaService} from './grupo-pregunta.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GrupoPreguntaEditarComponent} from './grupo-pregunta-editar.component';
import {log} from 'util';

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
    console.log('aaaadfasa');
    this.refreshData();

  }

  refreshData() {
    this.servicioGrupoPregunta.getGrupoPreguntas().subscribe(
      data => {
        this.grupoPreguntas = data;
      }, error2 => this.errorMessage = error2
    );
  }

  ver(id: number) {

    const modalRef = this.modalService.open(GrupoPreguntaEditarComponent);
    modalRef.result.then(x => {
      this.refreshData();
    }, (reason) => {
      this.refreshData();
    });
    modalRef.componentInstance.id = id;
  }
}
