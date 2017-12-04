import { TestBed, inject } from '@angular/core/testing';

import { TipoPreguntaService } from './tipo-pregunta.service';

describe('TipoPreguntaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoPreguntaService]
    });
  });

  it('should be created', inject([TipoPreguntaService], (service: TipoPreguntaService) => {
    expect(service).toBeTruthy();
  }));
});
