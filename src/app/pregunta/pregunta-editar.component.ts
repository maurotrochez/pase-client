import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControlName, FormGroup, Validators} from "@angular/forms";
import {IPregunta} from "./pregunta";
import {ActivatedRoute, Router} from "@angular/router";
import {PreguntaService} from "./pregunta.service";
import {GenericValidator} from "../shared/generic-validator";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';

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

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private servicioPregunta: PreguntaService) {
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
    this.preguntaForm = this.fb.group({
      descripcion: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]],
      tipoPregun: ['', Validators.required],
      grupoPregun: ['', Validators.required],
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

  onPreguntaRetrieved(pregunta: IPregunta): void {
    if (this.preguntaForm)
      this.preguntaForm.reset();
    this.pregunta = pregunta;

    if (this.pregunta.preguntaId == 0)
      this.pageTitle = 'Agregar Pregunta';
    else
      this.pageTitle = `Editar Pregunta: ${this.pregunta.descripcion}`;

    this.preguntaForm.patchValue({
      descripcionPregunta: this.pregunta.descripcion,
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
