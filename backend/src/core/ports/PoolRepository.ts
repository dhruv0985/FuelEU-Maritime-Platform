import { Pool, PoolMember } from '../domain/Pool';

export interface PoolRepository {
  create(pool: Omit<Pool, 'id' | 'createdAt'>): Promise<Pool>;
  addMember(member: PoolMember): Promise<void>;
  findMembersByPoolId(poolId: string): Promise<PoolMember[]>;
  findByYear(year: number): Promise<Pool[]>;
}

