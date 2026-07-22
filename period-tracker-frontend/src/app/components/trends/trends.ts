import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PeriodService } from '../../services/period.service';
import { Period } from '../../../models/interfaces';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trends.html',
  styleUrls: ['./trends.css']
})
export class TrendsComponent implements OnInit, OnDestroy {
  periods: Period[] = [];
  isLoading = true;
  isDemoData = false;
  error: string | null = null;
  private refreshSub?: Subscription;

  // Stats
  avgCycleLength = 0;
  avgPeriodDuration = 0;
  totalPeriods = 0;
  longestCycle = 0;
  shortestCycle = 0;

  constructor(private periodService: PeriodService) {}

  ngOnInit(): void {
    this.loadTrends();
    this.refreshSub = this.periodService.refresh$.subscribe(() => this.loadTrends());
  }

  loadTrends(): void {
    this.isLoading = true;

    this.periodService.getPeriods().subscribe({
      next: (data) => {
        this.periods = data.length
          ? data.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          : [];

        if (this.periods.length < 2) {
          this.isDemoData = true;
          this.loadDemoData();
          return;
        }

        this.isDemoData = false;
        this.calculateTrends();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load trends data';
        this.isLoading = false;
      }
    });
  }

  private calculateTrends(): void {
    this.totalPeriods = this.periods.length;
    if (this.totalPeriods < 2) return;

    let totalCycleLength = 0;
    let totalDuration = 0;
    let maxCycle = 0;
    let minCycle = Infinity;

    for (let i = 1; i < this.periods.length; i++) {
      const prevEnd = this.periods[i-1].endDate || this.periods[i-1].startDate;
      const currentStart = this.periods[i].startDate;

      const cycleLength = this.daysBetween(prevEnd, currentStart);
      totalCycleLength += cycleLength;

      if (cycleLength > maxCycle) maxCycle = cycleLength;
      if (cycleLength < minCycle) minCycle = cycleLength;
    }

    // Average cycle length
    this.avgCycleLength = Math.round(totalCycleLength / (this.periods.length - 1));

    // Average period duration
    this.periods.forEach(p => {
      totalDuration += this.calculateDuration(p.startDate, p.endDate);
    });
    this.avgPeriodDuration = Math.round(totalDuration / this.totalPeriods);

    this.longestCycle = maxCycle;
    this.shortestCycle = minCycle === Infinity ? 0 : minCycle;
  }

  private loadDemoData(): void {
    this.periods = [
      { _id: 'demo1', startDate: new Date('2026-05-02'), endDate: new Date('2026-05-06'), flow: 'medium', symptoms: ['Cramping', 'Fatigue'], notes: 'Felt balanced and hydrated' },
      { _id: 'demo2', startDate: new Date('2026-05-30'), endDate: new Date('2026-06-03'), flow: 'heavy', symptoms: ['Bloating', 'Headache'], notes: 'Heavier flow this cycle' },
      { _id: 'demo3', startDate: new Date('2026-06-26'), endDate: new Date('2026-06-30'), flow: 'medium', symptoms: ['Mood Swings'], notes: 'Good energy levels' },
      { _id: 'demo4', startDate: new Date('2026-07-24'), endDate: new Date('2026-07-27'), flow: 'light', symptoms: ['Tenderness'], notes: 'Shorter cycle, feeling good' },
      { _id: 'demo5', startDate: new Date('2026-08-20'), endDate: new Date('2026-08-23'), flow: 'medium', symptoms: ['Headache', 'Cramps'], notes: 'Stayed active and hydrated' }
    ];
    this.calculateTrends();
    this.isLoading = false;
  }

  private daysBetween(date1: Date | string, date2: Date | string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }

  calculateDuration(startDate: Date | string, endDate?: Date | string): number {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 3600 * 24)) + 1;
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }
}