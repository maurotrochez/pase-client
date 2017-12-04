import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoPreguntaListaComponent } from './tipo-pregunta-lista.component';
import {RouterModule} from "@angular/router";
import {TipoPreguntaService} from "./tipo-pregunta.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TipoPreguntaEditarComponent } from './tipo-pregunta-editar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'tipos', component: TipoPreguntaListaComponent },
      { path: 'tipoPreguntaEditar/:id',
        // canDeactivate: [ ProductEditGuard ],
        component: TipoPreguntaEditarComponent },
    ])
  ],
  declarations: [TipoPreguntaListaComponent, TipoPreguntaEditarComponent],
  providers: [TipoPreguntaService]
})
export class TipoPreguntaModule { }
