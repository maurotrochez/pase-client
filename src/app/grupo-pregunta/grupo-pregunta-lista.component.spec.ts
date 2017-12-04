import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoPreguntaListaComponent } from './grupo-pregunta-lista.component';

describe('GrupoPreguntaListaComponent', () => {
  let component: GrupoPreguntaListaComponent;
  let fixture: ComponentFixture<GrupoPreguntaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoPreguntaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoPreguntaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
