// src/app/services/period.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Period } from '../../models/interfaces';

@Injectable({ providedIn: 'root' })
export class PeriodService {
  private apiUrl = 'http://localhost:3000/api/periods';
  private refreshSubject = new Subject<void>();

  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Get all periods from database for the logged-in user */
  getPeriods(): Observable<Period[]> {
    return this.http.get<Period[]>(this.apiUrl);
  }

  /** Create new period entry */
  createPeriod(period: any): Observable<Period> {
    return this.http.post<Period>(this.apiUrl, period);
  }

  /** Delete a period by ID */
  deletePeriod(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /** Get cycle predictions (average + next date) */
  getPredictions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/predictions`);
  }

  /** Call this after create/update/delete to refresh UI */
  notifyRefresh(): void {
    this.refreshSubject.next();
  }
}