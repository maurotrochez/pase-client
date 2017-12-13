import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControl, FormControlName, FormGroup, Validators} from "@angular/forms";
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
import {isNumber} from "util";

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
  textoLargo = false;
  textoCorto = false;
  dicotomica = false;
  opcionMultiple = false;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private servicioPregunta: PreguntaService,
              private servicioTiposPregunta: TipoPreguntaService,
              private servicioGrupos: GrupoPreguntaService) {
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
      estado: ['', Validators.required],
      dependencia: [''],
      texto: ['']
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
          if (selectedTipo.descripcion === "Nuevo modif") {
            this.textoLargo = true;
          }
        }
      }
    );

    //
    // this.preguntaForm.controls['tipoPregun'].setValue(selectedTipo);

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

    if (this.pregunta.preguntaId === 0)
      this.pageTitle = 'Agregar Pregunta';
    else
      this.pageTitle = `Editar Pregunta: ${this.pregunta.descripcion}`;

    this.preguntaForm.patchValue({
      descripcion: this.pregunta.descripcion,
      grupoPregun: this.pregunta.grupoPregun,
      tipoPregun: this.pregunta.tipoPregun,
      estado: this.pregunta.estado
    });
  }

  savePregunta(): void {
    if (this.preguntaForm.dirty && this.preguntaForm.valid) {
      let t = Object.assign({}, this.pregunta, this.preguntaForm.value);

      this.servicioPregunta.savePregunta(t)
        .subscribe(
          () => this.onSaveComplete(),
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
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.preguntaForm.reset();
    this.router.navigate(['/preguntas']);
  }

}
