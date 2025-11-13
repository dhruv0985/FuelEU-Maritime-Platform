import { ComplianceBalanceRepository } from '../ports/ComplianceBalanceRepository';
import { BankEntryRepository } from '../ports/BankEntryRepository';
import { ApplyBankingResult } from '../domain/BankEntry';

export class ApplyBankedUseCase {
  constructor(
    private cbRepository: ComplianceBalanceRepository,
    private bankRepository: BankEntryRepository
  ) {}

  async execute(shipId: string, year: number, amount: number): Promise<ApplyBankingResult> {
    const cb = await this.cbRepository.findByShipAndYear(shipId, year);
    if (!cb) {
      throw new Error(`Compliance balance not found for ship ${shipId} in year ${year}`);
    }

    const totalBanked = await this.bankRepository.getTotalBanked(shipId, year);
    if (amount > totalBanked) {
      throw new Error(`Cannot apply ${amount}: only ${totalBanked} available in bank`);
    }

    const cbBefore = cb.cbGco2eq;
    const applied = Math.min(amount, Math.abs(cbBefore)); // Don't apply more than the deficit
    const cbAfter = cbBefore + applied;

    // Update CB
    await this.cbRepository.update(cb.id, { cbGco2eq: cbAfter });

    // Reduce banked amount (simplified: we'll track this in a separate table or reduce entries)
    // For simplicity, we'll assume the bank entries are consumed proportionally
    const remainingBanked = totalBanked - applied;

    return {
      cbBefore,
      applied,
      cbAfter,
      remainingBanked,
    };
  }
}

