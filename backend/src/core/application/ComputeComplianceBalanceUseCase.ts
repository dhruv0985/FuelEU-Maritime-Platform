import { RouteRepository } from '../ports/RouteRepository';
import { ComplianceBalanceRepository } from '../ports/ComplianceBalanceRepository';
import { calculateComplianceBalance } from '../domain/Route';
import { ComplianceBalance } from '../domain/ComplianceBalance';

export class ComputeComplianceBalanceUseCase {
  constructor(
    private routeRepository: RouteRepository,
    private cbRepository: ComplianceBalanceRepository
  ) {}

  async execute(shipId: string, year: number): Promise<ComplianceBalance> {
    // Get all routes for this ship and year
    const routes = await this.routeRepository.findAll();
    const shipRoutes = routes.filter(r => r.shipId === shipId && r.year === year);

    if (shipRoutes.length === 0) {
      throw new Error(`No routes found for ship ${shipId} in year ${year}`);
    }

    // Calculate weighted average GHG intensity
    let totalEnergy = 0;
    let weightedIntensity = 0;

    for (const route of shipRoutes) {
      const energy = route.fuelConsumption * 41000; // MJ
      totalEnergy += energy;
      weightedIntensity += route.ghgIntensity * energy;
    }

    const avgIntensity = totalEnergy > 0 ? weightedIntensity / totalEnergy : 0;
    const totalFuelConsumption = shipRoutes.reduce((sum, r) => sum + r.fuelConsumption, 0);
    const cbGco2eq = calculateComplianceBalance(avgIntensity, totalFuelConsumption);

    // Check if CB already exists
    const existing = await this.cbRepository.findByShipAndYear(shipId, year);
    
    if (existing) {
      return await this.cbRepository.update(existing.id, { cbGco2eq });
    }

    return await this.cbRepository.create({
      shipId,
      year,
      cbGco2eq,
    });
  }
}

