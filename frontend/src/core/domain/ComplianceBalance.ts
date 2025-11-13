export interface ComplianceBalance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number;
  createdAt: string;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  adjustedCbGco2eq: number;
}

