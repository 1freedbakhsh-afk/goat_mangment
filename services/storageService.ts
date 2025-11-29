import { Goat, Transaction, InventoryItem, Gender, BreedingStatus } from '../types';

const STORAGE_KEYS = {
  GOATS: 'capra_goats',
  TRANSACTIONS: 'capra_transactions',
  INVENTORY: 'capra_inventory',
};

// Seed Data for Demo
const SEED_GOATS: Goat[] = [
  {
    id: '1',
    tag: 'G-101',
    name: 'Bella',
    breed: 'Boer',
    gender: Gender.Female,
    dob: '2021-05-15',
    status: BreedingStatus.Pregnant,
    weightHistory: [
      { date: '2023-01-01', weight: 45 },
      { date: '2023-06-01', weight: 52 },
      { date: '2023-12-01', weight: 58 },
    ],
    healthRecords: [
      { id: 'h1', date: '2023-09-10', type: 'Vaccine', description: 'CDT Booster', cost: 12 },
      { id: 'h2', date: '2023-05-15', type: 'Checkup', description: 'Annual Physical', cost: 50 },
    ],
    notes: 'High milk yield expected.',
  },
  {
    id: '2',
    tag: 'G-102',
    name: 'Max',
    breed: 'Kalahari Red',
    gender: Gender.Male,
    dob: '2020-03-10',
    status: BreedingStatus.Open,
    weightHistory: [
      { date: '2023-01-01', weight: 85 },
      { date: '2023-12-01', weight: 92 },
    ],
    healthRecords: [
      { id: 'h3', date: '2023-10-01', type: 'Deworming', description: 'Routine Ivermectin', cost: 5 },
    ],
    notes: 'Primary sire.',
  },
  {
    id: '3',
    tag: 'G-103',
    name: 'Daisy',
    breed: 'Saanen',
    gender: Gender.Female,
    dob: '2022-01-20',
    status: BreedingStatus.Lactating,
    weightHistory: [{ date: '2023-12-01', weight: 48 }],
    healthRecords: [],
  }
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-01', type: 'Expense', category: 'Feed', amount: 450, description: 'Alfalfa hay' },
  { id: '2', date: '2023-10-05', type: 'Income', category: 'Sales', amount: 1200, description: 'Sold 3 kids' },
  { id: '3', date: '2023-10-10', type: 'Expense', category: 'Medicine', amount: 120, description: 'Dewormer' },
];

export const getGoats = (): Goat[] => {
  const data = localStorage.getItem(STORAGE_KEYS.GOATS);
  return data ? JSON.parse(data) : SEED_GOATS;
};

export const saveGoats = (goats: Goat[]) => {
  localStorage.setItem(STORAGE_KEYS.GOATS, JSON.stringify(goats));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : SEED_TRANSACTIONS;
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getInventory = (): InventoryItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  return data ? JSON.parse(data) : [
    { id: '1', name: 'Alfalfa Hay', category: 'Feed', quantity: 50, unit: 'bales', alertLevel: 10 },
    { id: '2', name: 'Dewormer (Ivermectin)', category: 'Medicine', quantity: 2, unit: 'bottles', alertLevel: 1 },
  ];
};

export const saveInventory = (items: InventoryItem[]) => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
};