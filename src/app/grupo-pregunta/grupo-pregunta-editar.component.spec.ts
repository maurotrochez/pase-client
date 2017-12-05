import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoPreguntaEditarComponent } from './grupo-pregunta-editar.component';

describe('GrupoPreguntaEditarComponent', () => {
  let component: GrupoPreguntaEditarComponent;
  let fixture: ComponentFixture<GrupoPreguntaEditarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoPreguntaEditarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoPreguntaEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
