import { GetRouteComparisonUseCase } from '../GetRouteComparisonUseCase';
import { RouteRepository } from '../../ports/RouteRepository';
import { Route } from '../../domain/Route';

describe('GetRouteComparisonUseCase', () => {
  let useCase: GetRouteComparisonUseCase;
  let mockRepository: jest.Mocked<RouteRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findByRouteId: jest.fn(),
      findByYear: jest.fn(),
      findByVesselType: jest.fn(),
      findByFuelType: jest.fn(),
      setBaseline: jest.fn(),
      findBaseline: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    useCase = new GetRouteComparisonUseCase(mockRepository);
  });

  it('should return comparisons for all routes except baseline', async () => {
    const baseline: Route = {
      id: '1',
      routeId: 'R001',
      vesselType: 'Container',
      fuelType: 'HFO',
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      isBaseline: true,
    };

    const route1: Route = {
      id: '2',
      routeId: 'R002',
      vesselType: 'BulkCarrier',
      fuelType: 'LNG',
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      isBaseline: false,
    };

    mockRepository.findBaseline.mockResolvedValue(baseline);
    mockRepository.findAll.mockResolvedValue([baseline, route1]);

    const result = await useCase.execute();

    expect(result).toHaveLength(1);
    expect(result[0].baseline).toEqual(baseline);
    expect(result[0].route).toEqual(route1);
  });

  it('should throw error when no baseline exists', async () => {
    mockRepository.findBaseline.mockResolvedValue(null);

    await expect(useCase.execute()).rejects.toThrow('No baseline route found');
  });
});

