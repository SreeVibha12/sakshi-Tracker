// src/app/models/user.model.ts
export interface User {
  id: string;
  email: string;
  name?: string;
}

// src/app/models/period.model.ts
export interface Period {
  _id?: string;
  startDate: Date;
  endDate?: Date;
  symptoms: string[];
  flow: 'light' | 'medium' | 'heavy';
  notes?: string;
}

// src/app/models/daily-log.model.ts
export interface DailyLog {
  _id?: string;
  date: Date;
  waterIntake: number; // in glasses
  sleepHours: number;
  mood: string;
}