import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// Minimal UI: removed Angular Material imports
import { CommonModule } from '@angular/common';
import { DailyService } from '../../services/daily.service';
import { DailyLog } from '../../../models/interfaces';
import {Router} from '@angular/router';


@Component({
  selector: 'app-daily-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dailytrack.html',
  styleUrls: ['./dailytrack.css']
})
export class DailyTrackerComponent {
  dailyForm: FormGroup;

  constructor(private fb: FormBuilder, private dailyService: DailyService, private router: Router) {
    this.dailyForm = this.fb.group({
      date: [new Date(), Validators.required],
      waterIntake: [8, [Validators.required, Validators.min(1)]],
      sleepHours: [7, [Validators.required, Validators.min(1)]],
      mood: ['good']
    });
  }

  onSubmit() {

  if (!this.dailyForm.valid) return;

  const log: DailyLog = {
    ...this.dailyForm.value
  };

  this.dailyService.createLog(log).subscribe({

    next: (savedLog) => {

      console.log("Daily log saved:", savedLog);
      this.router.navigate(['/dashboard']); 

      

      this.dailyForm.reset({
        date: new Date(),
        waterIntake: 8,
        sleepHours: 7,
        mood: 'good'
      });
      

    },

    error: err => {
      console.error(err);
    }

  });

}
}