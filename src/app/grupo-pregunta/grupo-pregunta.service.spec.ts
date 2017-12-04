import { TestBed, inject } from '@angular/core/testing';

import { GrupoPreguntaService } from './grupo-pregunta.service';

describe('GrupoPreguntaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrupoPreguntaService]
    });
  });

  it('should be created', inject([GrupoPreguntaService], (service: GrupoPreguntaService) => {
    expect(service).toBeTruthy();
  }));
});
