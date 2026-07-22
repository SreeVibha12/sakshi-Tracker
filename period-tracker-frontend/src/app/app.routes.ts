// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { PeriodLogComponent } from './components/periodlog/periodlog';
import { HistoryComponent } from './components/history/history';
import { DailyTrackerComponent } from './components/dailytrack/dailytrack';
import { TrendsComponent } from './components/trends/trends';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'log-period', component: PeriodLogComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'daily', component: DailyTrackerComponent },
  { path: 'trends', component: TrendsComponent },
  { path: '**', redirectTo: '/login' }
];