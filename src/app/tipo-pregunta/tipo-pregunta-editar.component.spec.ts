import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoPreguntaEditarComponent } from './tipo-pregunta-editar.component';

describe('TipoPreguntaEditarComponent', () => {
  let component: TipoPreguntaEditarComponent;
  let fixture: ComponentFixture<TipoPreguntaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoPreguntaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoPreguntaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
