import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbPool } from '../db/connection';
import { PostgresRouteRepository } from '../../adapters/outbound/postgres/PostgresRouteRepository';
import { PostgresComplianceBalanceRepository } from '../../adapters/outbound/postgres/PostgresComplianceBalanceRepository';
import { PostgresBankEntryRepository } from '../../adapters/outbound/postgres/PostgresBankEntryRepository';
import { PostgresPoolRepository } from '../../adapters/outbound/postgres/PostgresPoolRepository';
import { GetRoutesUseCase } from '../../core/application/GetRoutesUseCase';
import { SetBaselineUseCase } from '../../core/application/SetBaselineUseCase';
import { GetRouteComparisonUseCase } from '../../core/application/GetRouteComparisonUseCase';
import { ComputeComplianceBalanceUseCase } from '../../core/application/ComputeComplianceBalanceUseCase';
import { BankSurplusUseCase } from '../../core/application/BankSurplusUseCase';
import { ApplyBankedUseCase } from '../../core/application/ApplyBankedUseCase';
import { CreatePoolUseCase } from '../../core/application/CreatePoolUseCase';
import { GetAdjustedCbUseCase } from '../../core/application/GetAdjustedCbUseCase';
import { RoutesController } from '../../adapters/inbound/http/routesController';
import { ComplianceController } from '../../adapters/inbound/http/complianceController';
import { BankingController } from '../../adapters/inbound/http/bankingController';
import { PoolingController } from '../../adapters/inbound/http/poolingController';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize repositories
const routeRepository = new PostgresRouteRepository(dbPool);
const cbRepository = new PostgresComplianceBalanceRepository(dbPool);
const bankRepository = new PostgresBankEntryRepository(dbPool);
const poolRepository = new PostgresPoolRepository(dbPool);

// Initialize use cases
const getRoutesUseCase = new GetRoutesUseCase(routeRepository);
const setBaselineUseCase = new SetBaselineUseCase(routeRepository);
const getRouteComparisonUseCase = new GetRouteComparisonUseCase(routeRepository);
const computeCbUseCase = new ComputeComplianceBalanceUseCase(routeRepository, cbRepository);
const bankSurplusUseCase = new BankSurplusUseCase(cbRepository, bankRepository);
const applyBankedUseCase = new ApplyBankedUseCase(cbRepository, bankRepository);
const createPoolUseCase = new CreatePoolUseCase(poolRepository, cbRepository);
const getAdjustedCbUseCase = new GetAdjustedCbUseCase(cbRepository, bankRepository, poolRepository);

// Initialize controllers
const routesController = new RoutesController(getRoutesUseCase, setBaselineUseCase, getRouteComparisonUseCase);
const complianceController = new ComplianceController(computeCbUseCase, getAdjustedCbUseCase);
const bankingController = new BankingController(bankSurplusUseCase, applyBankedUseCase, bankRepository);
const poolingController = new PoolingController(createPoolUseCase);

// Routes
app.get('/routes', (req, res) => routesController.getAll(req, res));
app.post('/routes/:routeId/baseline', (req, res) => routesController.setBaseline(req, res));
app.get('/routes/comparison', (req, res) => routesController.getComparison(req, res));

app.get('/compliance/cb', (req, res) => complianceController.getCb(req, res));
app.get('/compliance/adjusted-cb', (req, res) => complianceController.getAdjustedCb(req, res));

app.get('/banking/records', (req, res) => bankingController.getRecords(req, res));
app.post('/banking/bank', (req, res) => bankingController.bank(req, res));
app.post('/banking/apply', (req, res) => bankingController.apply(req, res));

app.post('/pools', (req, res) => poolingController.createPool(req, res));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

