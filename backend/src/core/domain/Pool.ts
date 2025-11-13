export interface Pool {
  id: string;
  year: number;
  createdAt: Date;
}

export interface PoolMember {
  poolId: string;
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

export interface PoolCreationResult {
  poolId: string;
  members: PoolMember[];
  totalCbBefore: number;
  totalCbAfter: number;
}

export interface PoolValidationError {
  message: string;
  code: 'INSUFFICIENT_SURPLUS' | 'DEFICIT_WORSE' | 'SURPLUS_NEGATIVE';
}

