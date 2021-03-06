import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
// import {PreguntaListaComponent} from "./pregunta/pregunta-lista.component";
import {PreguntaModule} from "./pregunta/pregunta.module";
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {TipoPreguntaModule} from "./tipo-pregunta/tipo-pregunta.module";
import {GrupoPreguntaModule} from "./grupo-pregunta/grupo-pregunta.module";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent}
    ]),
    PreguntaModule,
    TipoPreguntaModule,
    GrupoPreguntaModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
