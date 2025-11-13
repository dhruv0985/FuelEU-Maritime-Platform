import { BankEntry } from '../domain/BankEntry';

export interface BankEntryRepository {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  create(entry: Omit<BankEntry, 'id' | 'createdAt'>): Promise<BankEntry>;
  update(id: string, entry: Partial<BankEntry>): Promise<BankEntry>;
}

