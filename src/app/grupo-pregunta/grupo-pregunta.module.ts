import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GrupoPreguntaListaComponent} from './grupo-pregunta-lista.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {GrupoPreguntaService} from "./grupo-pregunta.service";
import { GrupoPreguntaEditarComponent } from './grupo-pregunta-editar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([
      {path: 'grupos', component: GrupoPreguntaListaComponent},
      { path: 'grupoPreguntaEditar/:id',
      // canDeactivate: [ ProductEditGuard ],
      component: GrupoPreguntaEditarComponent },
    ])
  ],
  declarations: [GrupoPreguntaListaComponent, GrupoPreguntaEditarComponent],
  providers: [GrupoPreguntaService]
})
export class GrupoPreguntaModule {
}
