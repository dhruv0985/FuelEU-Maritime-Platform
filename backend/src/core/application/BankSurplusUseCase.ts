import { ComplianceBalanceRepository } from '../ports/ComplianceBalanceRepository';
import { BankEntryRepository } from '../ports/BankEntryRepository';
import { BankingResult } from '../domain/BankEntry';

export class BankSurplusUseCase {
  constructor(
    private cbRepository: ComplianceBalanceRepository,
    private bankRepository: BankEntryRepository
  ) {}

  async execute(shipId: string, year: number): Promise<BankingResult> {
    const cb = await this.cbRepository.findByShipAndYear(shipId, year);
    if (!cb) {
      throw new Error(`Compliance balance not found for ship ${shipId} in year ${year}`);
    }

    if (cb.cbGco2eq <= 0) {
      throw new Error('Cannot bank: Compliance balance is not positive');
    }

    const cbBefore = cb.cbGco2eq;
    const banked = cbBefore;

    // Create bank entry
    await this.bankRepository.create({
      shipId,
      year,
      amountGco2eq: banked,
    });

    // Update CB to zero (surplus is banked)
    const updated = await this.cbRepository.update(cb.id, { cbGco2eq: 0 });

    return {
      cbBefore,
      banked,
      cbAfter: updated.cbGco2eq,
    };
  }
}

