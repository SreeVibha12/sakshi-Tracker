import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Removed Angular Material imports for simpler UI
import { PeriodService } from '../../services/period.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-period-log',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './periodlog.html',
  styleUrls: ['./periodlog.css']
})
export class PeriodLogComponent {
  logForm: FormGroup;
  symptomsList = ['Cramps', 'Headache', 'Mood Swings', 'Fatigue', 'Bloating', 'Nausea'];

  constructor(
    private fb: FormBuilder,
    private periodService: PeriodService,
    private router: Router
  ) {
    this.logForm = this.fb.group({
      startDate: [formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), Validators.required],
      endDate: [''],
      flow: ['medium', Validators.required],
      symptoms: [[]],
      notes: ['']
    });
  }

  onSubmit() {
    if (this.logForm.valid) {
      const values = this.logForm.value;
      console.log('Submitting period log:', values);
      this.periodService.createPeriod(values).subscribe({
        next: async (period) => {
          console.log('Period saved successfully:', period);
          const formattedDate = formatDate(values.startDate, 'longDate', 'en-US');
          localStorage.setItem('lastPeriodDate', formattedDate);
           await this.router.navigateByUrl('/dashboard').then(() => {
           console.log('dashbaord nagivated');
          });
        },
        error: (err) => console.error(err)
      });
    }
  }
}