import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntaListaComponent } from './pregunta-lista.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PreguntaService} from "./pregunta.service";
import { PreguntaEditarComponent } from './pregunta-editar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'preguntas', component: PreguntaListaComponent },
      { path: 'preguntaEditar/:id',
        // canDeactivate: [ ProductEditGuard ],
        component: PreguntaEditarComponent },
    ])
  ],
  declarations: [PreguntaListaComponent, PreguntaEditarComponent],
  providers: [PreguntaService]
})
export class PreguntaModule { }
