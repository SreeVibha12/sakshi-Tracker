import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyLog } from '../../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DailyService {

  private apiUrl = 'http://localhost:3000/api/daily';

  constructor(private http: HttpClient) {}

  getLogs(): Observable<DailyLog[]> {
    return this.http.get<DailyLog[]>(this.apiUrl);
  }

  createLog(log: DailyLog): Observable<DailyLog> {
    return this.http.post<DailyLog>(this.apiUrl, log);
  }
}