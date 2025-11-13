import { Request, Response } from 'express';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

export class PoolingController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  async createPool(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;

      if (!year || !Array.isArray(shipIds) || shipIds.length === 0) {
        res.status(400).json({ error: 'year and shipIds array are required' });
        return;
      }

      const result = await this.createPoolUseCase.execute(year, shipIds);
      res.json(result);
    } catch (error) {
      const err = error as any;
      if (err.code) {
        res.status(400).json({ error: err.message, code: err.code });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  }
}

