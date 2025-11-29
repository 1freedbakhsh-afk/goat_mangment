export enum Gender {
  Male = 'Male',
  Female = 'Female'
}

export enum BreedingStatus {
  Open = 'Open',
  Mated = 'Mated',
  Pregnant = 'Pregnant',
  Lactating = 'Lactating',
  Dry = 'Dry'
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface HealthRecord {
  id: string;
  date: string;
  type: 'Vaccine' | 'Deworming' | 'Treatment' | 'Checkup';
  description: string;
  cost: number;
}

export interface Goat {
  id: string;
  tag: string;
  name: string;
  breed: string;
  gender: Gender;
  dob: string;
  sire?: string;
  dam?: string;
  status: BreedingStatus;
  weightHistory: WeightRecord[];
  healthRecords: HealthRecord[];
  notes?: string;
  photoUrl?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Feed' | 'Medicine' | 'Equipment';
  quantity: number;
  unit: string;
  alertLevel: number;
}

export interface DashboardStats {
  totalGoats: number;
  pregnantCount: number;
  kidsCount: number; // Assuming < 6 months
  monthlyExpense: number;
  monthlyIncome: number;
}
