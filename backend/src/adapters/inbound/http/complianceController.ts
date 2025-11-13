import { Request, Response } from 'express';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/ComputeComplianceBalanceUseCase';
import { GetAdjustedCbUseCase } from '../../../core/application/GetAdjustedCbUseCase';

export class ComplianceController {
  constructor(
    private computeCbUseCase: ComputeComplianceBalanceUseCase,
    private getAdjustedCbUseCase: GetAdjustedCbUseCase
  ) {}

  async getCb(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const cb = await this.computeCbUseCase.execute(shipId, year);
      res.json(cb);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getAdjustedCb(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const adjustedCb = await this.getAdjustedCbUseCase.execute(shipId, year);
      res.json(adjustedCb);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

