import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChildren} from '@angular/core';
import {FormBuilder, FormControlName, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {IGrupoPregunta} from './grupo-pregunta';
import {Subscription} from 'rxjs/Subscription';
import {GenericValidator} from '../shared/generic-validator';
import {Observable} from 'rxjs/Observable';
import {GrupoPreguntaService} from './grupo-pregunta.service';
import {HttpErrorResponse} from '@angular/common/http';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {GrupoPreguntaListaComponent} from './grupo-pregunta-lista.component';
import {Location} from '@angular/common';
// CommonJS

const swal = require('sweetalert2');

@Component({
  selector: 'app-grupo-pregunta-editar',
  templateUrl: './grupo-pregunta-editar.component.html',
  styleUrls: ['./grupo-pregunta-editar.component.css']
})
export class GrupoPreguntaEditarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() id;
  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];
  pageTitle = 'Editar grupo de pregunta';
  errorMessage: string;
  grupoPreguntaForm: FormGroup;

  grupoPregunta: IGrupoPregunta;
  private sub: Subscription;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private servicioGrupoPregunta: GrupoPreguntaService,
              private activeModal: NgbActiveModal) {

    this.validationMessages = {
      descripcion: {
        required: 'La descripción es requerida.',
        minlength: 'La descripción debe tener al menos 3 caracteres.',
        maxlength: 'La descripción no puede execeder 50 caracteres.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.grupoPreguntaForm = this.fb.group({
      descripcion: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)]]
    });
    this.getGrupoPregunta(this.id);

  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.grupoPreguntaForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.grupoPreguntaForm);
    });
  }

  ngOnDestroy(): void {
    //this.sub.unsubscribe();
  }

  getGrupoPregunta(id: number): void {
    this.servicioGrupoPregunta.getGrupoPregunta(id).subscribe(
      (grupo: IGrupoPregunta) => this.onGrupoRetrieved(grupo),
      (error: any) => {
        this.errorMessage = <any>error;
        swal({
          title: 'Error',
          text: this.errorMessage,
          type: 'error',
          allowOutsideClick: false,
        });
      }
    );
  }

  onGrupoRetrieved(tipo: IGrupoPregunta): void {
    if (this.grupoPreguntaForm)
      this.grupoPreguntaForm.reset();
    this.grupoPregunta = tipo;

    if (this.grupoPregunta.grupoPreguntaId === 0)
      this.pageTitle = 'Agregar Tipo de pregunta';
    else
      this.pageTitle = `Editar Tipo de pregunta: ${this.grupoPregunta.descripcion}`;

    this.grupoPreguntaForm.patchValue({
      descripcion: this.grupoPregunta.descripcion
    });
  }

  saveGrupoPregunta(): void {
    if (this.grupoPreguntaForm.dirty && this.grupoPreguntaForm.valid) {
      const t = Object.assign({}, this.grupoPregunta, this.grupoPreguntaForm.value);

      this.servicioGrupoPregunta.saveGrupoPregunta(t)
        .subscribe(
          (data) => {
            swal({
              title: 'Excelente!',
              text: data,
              type: 'success',
              button: 'Ok!',
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
              title: 'Error',
              text: this.errorMessage,
              type: 'error',
              allowOutsideClick: false,
            });
          }
        );
    } else if (!this.grupoPreguntaForm.dirty) {
      this.onSaveComplete();
    }
  }

  deleteGrupoPregunta(): void {
    if (this.grupoPregunta.grupoPreguntaId === 0) {
      this.onSaveComplete();
    } else {
      if (confirm(`Está seguro de eliminar: ${this.grupoPregunta.descripcion}?`)) {
        this.servicioGrupoPregunta.deleteGrupoPregunta(this.grupoPregunta.grupoPreguntaId)
          .subscribe(
            () => this.onSaveComplete(),
            (error: HttpErrorResponse) => {
              this.errorMessage = <any>error;
              swal({
                title: 'Error',
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
    this.activeModal.close();
    this.grupoPreguntaForm.reset();
    //this.componentList.ngOnInit();

  }

  close(){
    this.activeModal.close();
  }
}
