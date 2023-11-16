import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AddPatientFormComponent } from './components/add-patient-form/add-patient-form.component';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TableComponent } from './components/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AddPatientFormComponent, HttpClientModule, TableComponent],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'medical_redis';
  showAddForm = false;
  patientData: Observable<any>;
  destroy$ = new Subject()

  constructor(private Api: ApiService) {
    this.patientData = this.Api.getAllPatients()
  }

  listenToCancelEvent(data: boolean | any) {
    this.showAddForm = data
  }

  addPatient(data: Object | any) {
    this.Api.addPatient(data).pipe(takeUntil(this.destroy$)).subscribe(val => {
      console.log('RETURN', val)
    })
  }

  deletePatientRec(id: string | number) {
    this.Api.deletePatient(id).pipe(takeUntil(this.destroy$)).subscribe(val => {
      console.log('RETURN', val)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
