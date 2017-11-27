import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaListaComponent } from './pregunta-lista.component';

describe('PreguntaListaComponent', () => {
  let component: PreguntaListaComponent;
  let fixture: ComponentFixture<PreguntaListaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntaListaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
