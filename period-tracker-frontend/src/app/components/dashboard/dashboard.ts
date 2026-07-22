import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PeriodService } from '../../services/period.service';
import { DailyService } from '../../services/daily.service';

import { Period, DailyLog } from '../../../models/interfaces';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  avgCycle = 28;
  nextPeriod = 'Loading...';
  lastPeriodDate = 'No recent period logged';

  recentPeriods: Period[] = [];
  dailyLogs: DailyLog[] = [];

  insights = [
    'Cycle looks regular',
    'Log your daily water & sleep'
  ];

  constructor(
    private periodService: PeriodService,
    private dailyService: DailyService
  ) {}

  ngOnInit(): void {
    console.log('DashboardComponent initialized');
    this.loadDashboard();
  }

  loadDashboard(): void {

    console.log('===== LOAD DASHBOARD =====');

    this.periodService.getPredictions().subscribe({
      next: (data) => {
        console.log('Prediction API:', data);

        this.avgCycle = data.avgCycle;
        this.nextPeriod = data.nextPeriod;

        console.log('nextPeriod AFTER assign:', this.nextPeriod);
      },
      error: err => console.error('Prediction ERROR', err)
    });

    this.periodService.getPeriods().subscribe({
      next: (periods) => {

        console.log('Periods API:', periods);

        this.recentPeriods = [...periods];

        this.lastPeriodDate =
          periods.length
            ? formatDate(periods[0].startDate, 'longDate', 'en-US')
            : 'No recent period logged';

        console.log('recentPeriods AFTER assign', this.recentPeriods);
        console.log('lastPeriodDate AFTER assign', this.lastPeriodDate);
      },
      error: err => console.error('Periods ERROR', err)
    });

    this.dailyService.getLogs().subscribe({
      next: (logs) => {
        console.log('Daily Logs API:', logs);
        this.dailyLogs = logs;
      },
      error: err => console.error('Daily Logs ERROR', err)
    });
  }

}
// import { Component, OnInit } from '@angular/core';
// import { CommonModule, formatDate } from '@angular/common';
// import { RouterLink } from '@angular/router';

// import { PeriodService } from '../../services/period.service';
// import { DailyService } from '../../services/daily.service';

// import { Period, DailyLog } from '../../../models/interfaces';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css']
// })
// export class DashboardComponent implements OnInit {

//   avgCycle = 28;
//   nextPeriod = 'Loading...';
//   lastPeriodDate = 'No recent period logged';

//   recentPeriods: Period[] = [];
//   dailyLogs: DailyLog[] = [];

//   insights = [
//     'Cycle looks regular',
//     'Log your daily water & sleep'
//   ];

//   constructor(
//     private periodService: PeriodService,
//     private dailyService: DailyService
//   ) {}

//   ngOnInit(): void {
//     console.log('DashboardComponent initialized');
//     this.loadDashboard();
//   }
//   loadDashboard(): void {

//   console.log('===== LOAD DASHBOARD =====');

//   this.periodService.getPredictions().subscribe({
//     next: (data) => {
//       console.log('Prediction API:', data);

//       this.avgCycle = data.avgCycle;
//       this.nextPeriod = data.nextPeriod;

//       console.log('nextPeriod AFTER assign:', this.nextPeriod);
//     },
//     error: err => console.error('Prediction ERROR', err)
//   });

//   this.periodService.getPeriods().subscribe({
//     next: (periods) => {

//       console.log('Periods API:', periods);

//       this.recentPeriods = [...periods];

//       this.lastPeriodDate =
//         periods.length
//           ? formatDate(periods[0].startDate, 'longDate', 'en-US')
//           : 'No recent period logged';

//       console.log('recentPeriods AFTER assign', this.recentPeriods);
//       console.log('lastPeriodDate AFTER assign', this.lastPeriodDate);


//       setTimeout(() => {
//         console.log('1 second later...');
//         console.log('recentPeriods =', this.recentPeriods);
//         console.log('lastPeriodDate =', this.lastPeriodDate);
//         console.log('nextPeriod =', this.nextPeriod);
//       }, 1000);
//     },
//     error: err => console.error('Periods ERROR', err)
//   });
// }

// }