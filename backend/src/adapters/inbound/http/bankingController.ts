import { Request, Response } from 'express';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../../core/application/ApplyBankedUseCase';
import { BankEntryRepository } from '../../../core/ports/BankEntryRepository';

export class BankingController {
  constructor(
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedUseCase: ApplyBankedUseCase,
    private bankRepository: BankEntryRepository
  ) {}

  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const records = await this.bankRepository.findByShipAndYear(shipId, year);
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async bank(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const result = await this.bankSurplusUseCase.execute(shipId, year);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async apply(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || amount === undefined) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      const result = await this.applyBankedUseCase.execute(shipId, year, amount);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}

