import { ComplianceBalanceRepository } from '../ports/ComplianceBalanceRepository';
import { BankEntryRepository } from '../ports/BankEntryRepository';
import { PoolRepository } from '../ports/PoolRepository';
import { AdjustedComplianceBalance } from '../domain/ComplianceBalance';

export class GetAdjustedCbUseCase {
  constructor(
    private cbRepository: ComplianceBalanceRepository,
    private bankRepository: BankEntryRepository,
    private poolRepository: PoolRepository
  ) {}

  async execute(shipId: string, year: number): Promise<AdjustedComplianceBalance> {
    const cb = await this.cbRepository.findByShipAndYear(shipId, year);
    if (!cb) {
      throw new Error(`Compliance balance not found for ship ${shipId} in year ${year}`);
    }

    // Get banked amount
    const totalBanked = await this.bankRepository.getTotalBanked(shipId, year);

    // Get pool adjustments (if ship is in a pool)
    const pools = await this.poolRepository.findByYear(year);
    let poolAdjustment = 0;

    for (const pool of pools) {
      const members = await this.poolRepository.findMembersByPoolId(pool.id);
      const member = members.find(m => m.shipId === shipId);
      if (member) {
        poolAdjustment = member.cbAfter - member.cbBefore;
        break;
      }
    }

    // Adjusted CB = base CB - banked + pool adjustment
    const adjustedCbGco2eq = cb.cbGco2eq - totalBanked + poolAdjustment;

    return {
      ...cb,
      adjustedCbGco2eq,
    };
  }
}

