import { calculateComplianceBalance, calculatePercentDifference, isCompliant, TARGET_INTENSITY_2025 } from '../Route';

describe('Route Domain Logic', () => {
  describe('calculateComplianceBalance', () => {
    it('should calculate positive CB for intensity below target', () => {
      const ghgIntensity = 85.0;
      const fuelConsumption = 5000;
      const cb = calculateComplianceBalance(ghgIntensity, fuelConsumption);
      expect(cb).toBeGreaterThan(0);
    });

    it('should calculate negative CB for intensity above target', () => {
      const ghgIntensity = 95.0;
      const fuelConsumption = 5000;
      const cb = calculateComplianceBalance(ghgIntensity, fuelConsumption);
      expect(cb).toBeLessThan(0);
    });

    it('should return zero CB for intensity equal to target', () => {
      const ghgIntensity = TARGET_INTENSITY_2025;
      const fuelConsumption = 5000;
      const cb = calculateComplianceBalance(ghgIntensity, fuelConsumption);
      expect(cb).toBeCloseTo(0, 2);
    });
  });

  describe('calculatePercentDifference', () => {
    it('should calculate positive difference when comparison is higher', () => {
      const baseline = 90;
      const comparison = 95;
      const diff = calculatePercentDifference(baseline, comparison);
      expect(diff).toBeCloseTo(5.56, 2);
    });

    it('should calculate negative difference when comparison is lower', () => {
      const baseline = 90;
      const comparison = 85;
      const diff = calculatePercentDifference(baseline, comparison);
      expect(diff).toBeCloseTo(-5.56, 2);
    });
  });

  describe('isCompliant', () => {
    it('should return true for intensity below target', () => {
      expect(isCompliant(85.0)).toBe(true);
    });

    it('should return true for intensity equal to target', () => {
      expect(isCompliant(TARGET_INTENSITY_2025)).toBe(true);
    });

    it('should return false for intensity above target', () => {
      expect(isCompliant(95.0)).toBe(false);
    });
  });
});

