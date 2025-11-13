import { Request, Response } from 'express';
import { GetRoutesUseCase } from '../../../core/application/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../../core/application/SetBaselineUseCase';
import { GetRouteComparisonUseCase } from '../../../core/application/GetRouteComparisonUseCase';

export class RoutesController {
  constructor(
    private getRoutesUseCase: GetRoutesUseCase,
    private setBaselineUseCase: SetBaselineUseCase,
    private getRouteComparisonUseCase: GetRouteComparisonUseCase
  ) {}

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = {
        vesselType: req.query.vesselType as string | undefined,
        fuelType: req.query.fuelType as string | undefined,
        year: req.query.year ? parseInt(req.query.year as string) : undefined,
      };
      const routes = await this.getRoutesUseCase.execute(filters);
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const routeId = req.params.routeId;
      const route = await this.setBaselineUseCase.execute(routeId);
      res.json(route);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const comparisons = await this.getRouteComparisonUseCase.execute();
      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

