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

