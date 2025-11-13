import { PoolRepository } from '../ports/PoolRepository';
import { ComplianceBalanceRepository } from '../ports/ComplianceBalanceRepository';
import { PoolCreationResult, PoolValidationError } from '../domain/Pool';

export class CreatePoolUseCase {
  constructor(
    private poolRepository: PoolRepository,
    private cbRepository: ComplianceBalanceRepository
  ) {}

  async execute(year: number, shipIds: string[]): Promise<PoolCreationResult> {
    // Get adjusted CBs for all ships
    const members = await Promise.all(
      shipIds.map(async (shipId) => {
        const adjustedCb = await this.cbRepository.getAdjustedCb(shipId, year);
        if (!adjustedCb) {
          throw new Error(`Adjusted CB not found for ship ${shipId} in year ${year}`);
        }
        return {
          shipId,
          cbBefore: adjustedCb.adjustedCbGco2eq,
        };
      })
    );

    // Validate: Sum must be >= 0
    const totalCbBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCbBefore < 0) {
      const error: PoolValidationError = {
        message: 'Pool sum is negative',
        code: 'INSUFFICIENT_SURPLUS',
      };
      throw error;
    }

    // Greedy allocation: sort by CB descending, transfer surplus to deficits
    const sortedMembers = [...members].sort((a, b) => b.cbBefore - a.cbBefore);
    const allocations: { shipId: string; cbAfter: number }[] = [];

    let surplus = 0;
    for (const member of sortedMembers) {
      if (member.cbBefore >= 0) {
        surplus += member.cbBefore;
        allocations.push({ shipId: member.shipId, cbAfter: 0 });
      } else {
        const deficit = Math.abs(member.cbBefore);
        if (surplus >= deficit) {
          surplus -= deficit;
          allocations.push({ shipId: member.shipId, cbAfter: 0 });
        } else {
          allocations.push({ shipId: member.shipId, cbAfter: -(deficit - surplus) });
          surplus = 0;
        }
      }
    }

    // Validate exit conditions
    for (let i = 0; i < members.length; i++) {
      const before = members[i].cbBefore;
      const after = allocations.find(a => a.shipId === members[i].shipId)?.cbAfter ?? before;

      // Deficit ship cannot exit worse
      if (before < 0 && after < before) {
        const error: PoolValidationError = {
          message: `Deficit ship ${members[i].shipId} would exit worse`,
          code: 'DEFICIT_WORSE',
        };
        throw error;
      }

      // Surplus ship cannot exit negative
      if (before >= 0 && after < 0) {
        const error: PoolValidationError = {
          message: `Surplus ship ${members[i].shipId} would exit negative`,
          code: 'SURPLUS_NEGATIVE',
        };
        throw error;
      }
    }

    // Create pool
    const pool = await this.poolRepository.create({ year });

    // Add members
    const poolMembers = allocations.map(alloc => {
      const member = members.find(m => m.shipId === alloc.shipId)!;
      return {
        poolId: pool.id,
        shipId: alloc.shipId,
        cbBefore: member.cbBefore,
        cbAfter: alloc.cbAfter,
      };
    });

    for (const member of poolMembers) {
      await this.poolRepository.addMember(member);
    }

    const totalCbAfter = poolMembers.reduce((sum, m) => sum + m.cbAfter, 0);

    return {
      poolId: pool.id,
      members: poolMembers,
      totalCbBefore,
      totalCbAfter,
    };
  }
}

