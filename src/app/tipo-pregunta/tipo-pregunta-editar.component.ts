import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControlName, FormGroup, Validators} from "@angular/forms";
import {ITipoPregunta} from "./tipo-pregunta";
import {Subscription} from "rxjs/Subscription";
import {GenericValidator} from "../shared/generic-validator";
import {ActivatedRoute, Router} from "@angular/router";
import {TipoPreguntaService} from "./tipo-pregunta.service";
import {Observable} from "rxjs/Observable";
// CommonJS
const swal = require('sweetalert2');

@Component({
  selector: 'app-tipo-pregunta-editar',
  templateUrl: './tipo-pregunta-editar.component.html',
  styleUrls: ['./tipo-pregunta-editar.component.css']
})
export class TipoPreguntaEditarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  pageTitle: string = 'Editar tipo de pregunta';
  errorMessage: string;
  tipoPreguntaForm: FormGroup;

  tipoPregunta: ITipoPregunta;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private servicioTipoPregunta: TipoPreguntaService) {

    this.validationMessages = {
      descripcion: {
        required: 'La descripción es requerida.',
        minlength: 'La descripción debe tener al menos 3 caracteres.',
        maxlength: 'La descripción no puede execeder 50 caracteres.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.tipoPreguntaForm = this.fb.group({
      descripcion: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        const id = +params['id'];
        this.getTipoPregunta(id);
      }
    );
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.tipoPreguntaForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoPreguntaForm);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getTipoPregunta(id: number): void {
    this.servicioTipoPregunta.getTipoPregunta(id).subscribe(
      (tipo: ITipoPregunta) => this.onTipoRetrieved(tipo),
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

  onTipoRetrieved(tipo: ITipoPregunta): void {
    if (this.tipoPreguntaForm)
      this.tipoPreguntaForm.reset();
    this.tipoPregunta = tipo;

    if (this.tipoPregunta.tipoPreguntaId == 0)
      this.pageTitle = 'Agregar Tipo de pregunta';
    else
      this.pageTitle = `Editar Tipo de pregunta: ${this.tipoPregunta.descripcion}`;

    this.tipoPreguntaForm.patchValue({
      descripcion: this.tipoPregunta.descripcion
    });
  }

  saveTipoPregunta(): void {
    if (this.tipoPreguntaForm.dirty && this.tipoPreguntaForm.valid) {
      let t = Object.assign({}, this.tipoPregunta, this.tipoPreguntaForm.value);

      this.servicioTipoPregunta.saveTipoPregunta(t)
        .subscribe(
          (data) => {
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
            console.log(data);
          },
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
    } else if (!this.tipoPreguntaForm.dirty) {
      this.onSaveComplete();
    }
  }

  deleteTipoPregunta(): void {
    if (this.tipoPregunta.tipoPreguntaId === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Está seguro de eliminar: ${this.tipoPregunta.descripcion}?`)) {
        this.servicioTipoPregunta.deleteTipoPregunta(this.tipoPregunta.tipoPreguntaId)
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
    this.tipoPreguntaForm.reset();
    this.router.navigate(['/tipos']);
  }

}
