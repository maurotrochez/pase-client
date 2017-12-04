import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPreguntaListaComponent } from './tipo-pregunta-lista.component';

describe('TipoPreguntaListaComponent', () => {
  let component: TipoPreguntaListaComponent;
  let fixture: ComponentFixture<TipoPreguntaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoPreguntaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPreguntaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
