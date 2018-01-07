import {
  AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges,
  ViewChildren
} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
import {IPregunta} from "./pregunta";
import {ActivatedRoute, Router} from "@angular/router";
import {PreguntaService} from "./pregunta.service";
import {GenericValidator} from "../shared/generic-validator";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import {TipoPreguntaService} from "../tipo-pregunta/tipo-pregunta.service";
import {ITipoPregunta} from "../tipo-pregunta/tipo-pregunta";
import {IGrupoPregunta} from "../grupo-pregunta/grupo-pregunta";
import {GrupoPreguntaService} from "../grupo-pregunta/grupo-pregunta.service";
import {IRespuesta} from "./respuesta";
import {RespuestaPreguntaService} from "./respuesta-pregunta.service";
import {IEstado} from "./estado";
import {v4 as uuid} from 'uuid';

// CommonJS
const swal = require('sweetalert2');

@Component({
  // selector: 'app-pregunta-editar',
  templateUrl: './pregunta-editar.component.html',
  styleUrls: ['./pregunta-editar.component.css']
})
export class PreguntaEditarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  pageTitle = 'Editar Pregunta';
  errorMessage: string;
  preguntaForm: FormGroup;
  pregunta: IPregunta;
  private sub: Subscription;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  tipos: ITipoPregunta[] = [];
  grupos: IGrupoPregunta[] = [];
  listDespl = false;
  unicaRespuesta = false;
  seleccionMultiple = false;
  estados: IEstado[] = [{descripcion: 'Activo', id: 'A'}, {descripcion: 'Inactivo', id: 'I'}];
  tipoInput = 'radio';

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private servicioPregunta: PreguntaService,
              private servicioTiposPregunta: TipoPreguntaService,
              private servicioGrupos: GrupoPreguntaService,
              private servicioRespuestaPregunta: RespuestaPreguntaService) {
    this.validationMessages = {
      descripcion: {
        required: 'La descripción es requerida.',
        minlength: 'La descripción debe tener al menos 3 caracteres.',
        maxlength: 'La descripción no puede execeder 50 caracteres.'
      },
      tipoPregun: {
        required: 'El tipo de pregunta es requerido.'
      },
      grupoPregun: {
        required: 'El grupo de la pregunta es requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.getTiposPregunta();
    this.getGruposPregunta();
    this.preguntaForm = this.fb.group({
      descripcion: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      tipoPregun: new FormControl(this.tipos),
      grupoPregun: [this.grupos, Validators.required],
      estado: [this.estados, Validators.required],
      dependencia: [''],
      texto: [''],
      descripcionTextoLargo: [''],
      opciones: this.fb.array([])
    });

    this.sub = this.route.params.subscribe(
      params => {
        const id = +params['id'];
        this.getPregunta(id);
      }
    );

    this.getTiposPregunta();
    this.getGruposPregunta();

    this.preguntaForm.controls['tipoPregun'].valueChanges.subscribe(tipo => {
        if (tipo) {
          let selectedTipo = this.tipos.filter(p => p.tipoPreguntaId === +tipo)[0];
          // console.log(selectedTipo);
          // Seleccion multiple con unca respuesta
          if (selectedTipo && selectedTipo.tipoPreguntaId === 1) {
            this.listDespl = false;
            this.unicaRespuesta = true;
            this.seleccionMultiple = false;
            if (!this.opciones.length) {
              this.addOpcion();
            }
            this.tipoInput = 'radio';
          }
          // Seleccion multiple con varias respuestas
          else if (selectedTipo && selectedTipo.tipoPreguntaId === 2) {
            this.listDespl = false;
            this.unicaRespuesta = false;
            this.seleccionMultiple = true;
            if (!this.opciones.length) {
              this.addOpcion();
            }
            this.tipoInput = 'checkbox';
          }
          // Lista desplegable
          else if (selectedTipo && selectedTipo.tipoPreguntaId === 3) {
            this.listDespl = false;
            this.unicaRespuesta = false;
            this.seleccionMultiple = true;
            if (!this.opciones.length) {
              this.addOpcion();
            }
            this.tipoInput = 'radio';
          }
          // Respuesta corta
          else if (selectedTipo && selectedTipo.tipoPreguntaId === 4) {
            this.listDespl = false;
            this.unicaRespuesta = false;
            this.seleccionMultiple = false;
            GenericValidator.purgeForm(this.opciones);
          }
          // Parrafo
          else if (selectedTipo && selectedTipo.tipoPreguntaId === 5) {
            this.listDespl = false;
            this.unicaRespuesta = false;
            this.seleccionMultiple = false;
            GenericValidator.purgeForm(this.opciones);
          }
        }
      }
    );
  }

  selectTipo(tipo) {
    console.log(tipo);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.preguntaForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.preguntaForm);
    });
  }

  getPregunta(id: number): void {
    this.servicioPregunta.getPregunta(id).subscribe(
      (pregunta: IPregunta) => this.onPreguntaRetrieved(pregunta),
      (error: any) => this.errorMessage = <any>error
    );
  }

  getTiposPregunta() {
    this.servicioTiposPregunta.getTipoPreguntas().subscribe(
      (tipos: ITipoPregunta[]) => {
        this.tipos = tipos;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  getGruposPregunta(): void {
    this.servicioGrupos.getGrupoPreguntas().subscribe(
      (grupo: IGrupoPregunta[]) => {
        this.grupos = grupo;
      },
      (error: any) => this.errorMessage = <any>error
    );
  }

  onPreguntaRetrieved(pregunta: IPregunta): void {
    if (this.preguntaForm)
      this.preguntaForm.reset();
    this.pregunta = pregunta;

    if (this.pregunta.preguntaId === 0) {
      this.pageTitle = 'Agregar Pregunta';
      this.setOpciones([]);
    } else {
      this.pageTitle = `Editar Pregunta: ${this.pregunta.descripcion}`;
      if (this.pregunta.tipoPregun !== Number(4) || this.pregunta.tipoPregun !== Number(5)) {
        this.servicioRespuestaPregunta.getRespuestaPreguntasByPreguntaId(this.pregunta.preguntaId).subscribe(
          (data) => {
            this.setOpciones(data);
          }, (error: any) => this.errorMessage = <any>error
        );
      }
    }
    this.preguntaForm.patchValue({
      descripcion: this.pregunta.descripcion,
      grupoPregun: this.pregunta.grupoPregun,
      tipoPregun: this.pregunta.tipoPregun,
      estado: this.pregunta.estado
    });

    this.preguntaForm.updateValueAndValidity();
  }

  savePregunta(): void {
    if (this.preguntaForm.dirty && this.preguntaForm.valid) {
      let t = Object.assign({}, this.pregunta, this.preguntaForm.value);

      this.servicioPregunta.savePregunta(t)
        .subscribe(
          (data) => {
            console.log(data);
            if (t.tipoPregun === '4' || t.tipoPregun === '5') {
              swal({
                title: "Excelente!",
                text: data,
                type: 'success',
                button: "Ok!",
                allowOutsideClick: false,
              }).then((result) => {
                if (result.value) {
                  this.onSaveComplete();
                }
              });
            } else {
              t.opciones.forEach(x => {
                x.preguntaId = data;
                x.clave = Number(x.clave);
              });
              this.servicioRespuestaPregunta.saveRespuestaPreguntas(t.opciones).subscribe(
                (dataR) => {
                  swal({
                    title: "Excelente!",
                    text: dataR,
                    type: 'success',
                    button: "Ok!",
                    allowOutsideClick: false,
                  }).then((result) => {
                    if (result.value) {
                      this.onSaveComplete();
                    }
                  });

                }
              );
            }
          },
          (error: any) => {
            this.errorMessage = <any>error;
          }
        );
    } else if (!this.preguntaForm.dirty) {
      this.onSaveComplete();
    }
  }

  deletePregunta(): void {
    if (this.pregunta.preguntaId === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Está seguro de eliminar: ${this.pregunta.descripcion}?`)) {
        this.servicioPregunta.deletePregunta(this.pregunta.preguntaId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => {
              this.errorMessage = <any>error;
              swal({
                title: "Error",
                text: this.errorMessage,
                type: 'error',
                allowOutsideClick: false,
              });
            }
          );
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.preguntaForm.reset();
    this.router.navigate(['/preguntas']);
  }

  get opciones(): FormArray {
    return this.preguntaForm.get('opciones') as FormArray;
  }

  initOpcion() {
    let rest: IRespuesta = {descripcion: '', clave: false, id: uuid()};
    return this.fb.group(rest);
  }

  addOpcion() {
    const opc = this.initOpcion();
    this.opciones.push(opc);
  }

  assignClave(id: string) {
    this.preguntaForm.value.opciones.forEach(e => {
      if (this.tipoInput !== "checkbox") {
        e.clave = e.id === id;
      } else {
        if (e.id === id) {
          e.clave = !e.clave;
          return;
        }
      }
    });
  }

  setOpciones(opciones: IRespuesta[]) {
    const opcionFGs = opciones.map(opcion => this.fb.group(opcion));
    const opcionFormArray = this.fb.array(opcionFGs);
    this.preguntaForm.setControl('opciones', opcionFormArray);
  }

  onChangeClave(a) {
    console.log(a);
  }

  eliminarOpcion(i: number) {
    (this.preguntaForm.get('opciones') as FormArray).removeAt(i);
  }
}
