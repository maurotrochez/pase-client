import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import {RouterModule} from "@angular/router";
// import {PreguntaListaComponent} from "./pregunta/pregunta-lista.component";
import {PreguntaModule} from "./pregunta/pregunta.module";
import { HomeComponent } from './home/home.component';
import {HttpClientModule} from "@angular/common/http";
import {TipoPreguntaModule} from "./tipo-pregunta/tipo-pregunta.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent}
    ]),
    PreguntaModule,
    TipoPreguntaModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
