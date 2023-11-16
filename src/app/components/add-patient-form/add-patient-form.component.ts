import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient-form.component.html',
  styleUrl: './add-patient-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPatientFormComponent {
  patientForm: FormGroup = new FormGroup({
    id: new FormControl(Math.floor(Math.random() * 90 + 10)),
    name: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.compose([
      Validators.email,
      Validators.required
    ])),
    address: new FormControl(''),
    website: new FormControl(''),
    phone: new FormControl(''),
    company: new FormControl(''),
  })

  @Output() cancelData = new EventEmitter();
  @Output() submitData = new EventEmitter();

  get f() {
    return this.patientForm.controls
  }

  constructor() {}

  cancel() {
    this.cancelData.emit(false);
    this.patientForm.reset();
  }

  submitForm() {
    const payload: any = {
      ...this.patientForm.value,
      address: {
        street: this.f['address']?.value || 'Street Number 12',
        suite: 'Dummy suite',
        city: 'Wurzburg',
        zipcode: '1234567',
        geo: {
          lat: "-37.319",
          lon: "81.1496"
        },
      },
      company: {
        name: this.f['company']?.value,
        catchphrase: 'Multi-layered client-server neural-net',
        bs: 'harness real time e-markets'
      }
    }
    this.submitData.emit(payload)
    this.patientForm.reset();
  }
}
