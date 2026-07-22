import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeriodService } from '../../services/period.service';
import { Period } from '../../../models/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {
  periodHistory: Period[] = [];
  isLoading = true;
  error: string | null = null;

  // Filter options
  filter: 'all' | 'last6months' | 'lastYear' = 'all';

  private refreshSub?: Subscription;

  constructor(private periodService: PeriodService) {}

  ngOnInit(): void {
    this.loadHistory();
    this.refreshSub = this.periodService.refresh$.subscribe(() => this.loadHistory());
  }

  loadHistory(): void {
    this.isLoading = true;
    this.error = null;

    this.periodService.getPeriods().subscribe({
      next: (data) => {
        this.periodHistory = this.applyFilter(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        this.error = 'Unable to load period history. Please check your connection.';
        this.isLoading = false;
      }
    });
  }

  private applyFilter(data: Period[]): Period[] {
    if (this.filter === 'all') return [...data];

    const now = new Date();
    let cutoffDate: Date;

    if (this.filter === 'last6months') {
      cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
    } else { // lastYear
      cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }

    return data.filter(period => new Date(period.startDate) >= cutoffDate);
  }

  onFilterChange(newFilter: 'all' | 'last6months' | 'lastYear'): void {
    this.filter = newFilter;
    this.loadHistory();
  }

  // Optional: Delete a period entry
  deleteEntry(id: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.periodService.deletePeriod(id).subscribe({
        next: () => {
          this.periodService.notifyRefresh();
          this.loadHistory();
        },
        error: (err) => {
          console.error('Failed to delete entry:', err);
          alert('Failed to delete entry.');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

 calculateDuration(startDate: Date | string, endDate?: Date | string): number {
  if (!startDate) return 0;
  
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 3600 * 24)) + 1;
}
}