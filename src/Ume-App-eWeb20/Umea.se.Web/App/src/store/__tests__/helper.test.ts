import { ValidOrgNumberFormats } from '@/models/Enums';
import { describe, expect, test, vi } from 'vitest';
import { formatOrgNumber } from '@/store/helper';
vi.mock('@/utils/ErrorService', () => ({}));

describe('store/helper', () => {
	describe('formatOrgNumber', () => {
		test('Returns formatted 10 digit without', () => {
			const tests = [
				{ value: '5555555555', expected: '5555555555' },
				{ value: '555555-5555', expected: '5555555555' },
				{ value: '16555555-5555', expected: '5555555555' },
				{ value: '165555555555', expected: '5555555555' },
				{ value: '060604-1770', expected: '0606041770' },
				{ value: '20060604-1770', expected: '0606041770' },
			];
			tests.forEach((a) =>
				expect(
					formatOrgNumber(a.value, ValidOrgNumberFormats.Short)
				).toBe(a.expected)
			);
		});
		test('Returns formatted 10 digit with dash', () => {
			const tests = [
				{ value: '5555555555', expected: '555555-5555' },
				{ value: '555555-5555', expected: '555555-5555' },
				{ value: '16555555-5555', expected: '555555-5555' },
				{ value: '165555555555', expected: '555555-5555' },
				{ value: '060604-1770', expected: '060604-1770' },
				{ value: '200606041770', expected: '060604-1770' },
			];
			tests.forEach((a) =>
				expect(
					formatOrgNumber(a.value, ValidOrgNumberFormats.ShortDash)
				).toBe(a.expected)
			);
		});
		test('Returns formatted 12 digit without dash', () => {
			const tests = [
				{ value: '5555555555', expected: '165555555555' },
				{ value: '555555-5555', expected: '165555555555' },
				{ value: '16555555-5555', expected: '165555555555' },
				{ value: '165555555555', expected: '165555555555' },
				{ value: '060604-1770', expected: '200606041770' },
				{ value: '20060604-1770', expected: '200606041770' },
				{ value: '19060604-1770', expected: '190606041770' },
				{ value: '1406041770', expected: '191406041770' },
			];
			tests.forEach((a) =>
				expect(
					formatOrgNumber(a.value, ValidOrgNumberFormats.Long)
				).toBe(a.expected)
			);
		});
		test('Returns formatted 12 digit with dash', () => {
			const tests = [
				{ value: '5555555555', expected: '16555555-5555' },
				{ value: '555555-5555', expected: '16555555-5555' },
				{ value: '16555555-5555', expected: '16555555-5555' },
				{ value: '165555555555', expected: '16555555-5555' },
				{ value: '060604-1770', expected: '20060604-1770' },
				{ value: '200606041770', expected: '20060604-1770' },
				{ value: '20060604-1770', expected: '20060604-1770' },
				{ value: '190606041770', expected: '19060604-1770' },
				{ value: '1406041770', expected: '19140604-1770' },
			];
			tests.forEach((a) =>
				expect(
					formatOrgNumber(a.value, ValidOrgNumberFormats.LongDash)
				).toBe(a.expected)
			);
		});
	});
});
