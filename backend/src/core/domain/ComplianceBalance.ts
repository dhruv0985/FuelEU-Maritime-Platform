export interface ComplianceBalance {
  id: string;
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂e
  createdAt: Date;
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  adjustedCbGco2eq: number; // After banking/pooling adjustments
}

