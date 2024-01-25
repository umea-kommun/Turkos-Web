import { validate } from 'vee-validate';
import { describe, expect, test, beforeAll } from 'vitest';
import Validation from '@/plugins/validation';
import { I18n } from 'vue-i18n';

const generateString = (length: number): string => {
	let res = '';
	for (let i = 0; i < length; i++) {
		res += 'a';
	}
	return res;
};

describe('Validation Rules', () => {
	beforeAll(() => {
		const i18n = { global: { t: (t: string) => t } };
		Validation(i18n as I18n);
	});

	describe('required', () => {
		test('valid', async () => {
			const res = await validate('hej', 'required');
			expect(res.valid).toBe(true);
		});
		test('invalid', async () => {
			const res = await validate('', 'required');
			expect(res.valid).toBe(false);
		});
	});

	describe('phonenumber', () => {
		test('empty', async () => {
			const res = await validate('', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 1', async () => {
			const res = await validate('0736267844', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 2', async () => {
			const res = await validate('073 626 78 44', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 3', async () => {
			const res = await validate('073-626 78 44', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 4', async () => {
			const res = await validate('+46736267844', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 5', async () => {
			const res = await validate('+4673-626 78 44', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('valid 6', async () => {
			const res = await validate('+4673 626 78 44', 'phonenumber');
			expect(res.valid).toBe(true);
		});
		test('invalid 1', async () => {
			const res = await validate('-4673 626 78 44', 'phonenumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 2', async () => {
			const res = await validate('abc', 'phonenumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 3', async () => {
			const res = await validate('.', 'phonenumber');
			expect(res.valid).toBe(false);
		});
	});

	describe('oneOrMoreIsChecked', () => {
		test('valid 1', async () => {
			const res = await validate('', {
				oneOrMoreIsChecked: [
					[{ isChecked: true }, { isChecked: false }],
				],
			});
			expect(res.valid).toBe(true);
		});
		test('valid 2', async () => {
			const res = await validate('', {
				oneOrMoreIsChecked: [
					[{ isChecked: true }, { isChecked: true }],
				],
			});
			expect(res.valid).toBe(true);
		});
		test('invalid 1', async () => {
			const res = await validate('', {
				oneOrMoreIsChecked: [
					[{ isChecked: false }, { isChecked: false }],
				],
			});
			expect(res.valid).toBe(false);
		});
		test('invalid 2', async () => {
			const res = await validate('', {
				oneOrMoreIsChecked: [],
			});
			expect(res.valid).toBe(false);
		});
	});

	describe('zipCode', () => {
		test('empty', async () => {
			const res = await validate('', 'zipCode');
			expect(res.valid).toBe(true);
		});
		test('valid 1', async () => {
			const res = await validate('12345', 'zipCode');
			expect(res.valid).toBe(true);
		});
		test('valid 2', async () => {
			const res = await validate('123 45', 'zipCode');
			expect(res.valid).toBe(true);
		});
		test('invalid 1', async () => {
			const res = await validate('12 3 45', 'zipCode');
			expect(res.valid).toBe(false);
		});
		test('invalid 2', async () => {
			const res = await validate('abc', 'zipCode');
			expect(res.valid).toBe(false);
		});
		test('invalid 3', async () => {
			const res = await validate('123', 'zipCode');
			expect(res.valid).toBe(false);
		});
	});

	describe('macAddress', () => {
		test('empty', async () => {
			const res = await validate('', 'macAddress');
			expect(res.valid).toBe(true);
		});
		test('valid', async () => {
			const res = await validate('00:00:5e:00:53:af', 'macAddress');
			expect(res.valid).toBe(true);
		});
		test('invalid 1', async () => {
			const res = await validate('0:00:5e:ae:53:af', 'macAddress');
			expect(res.valid).toBe(false);
		});
		test('invalid 2', async () => {
			const res = await validate('192.168.1.1', 'macAddress');
			expect(res.valid).toBe(false);
		});
		test('invalid 3', async () => {
			const res = await validate('abc', 'macAddress');
			expect(res.valid).toBe(false);
		});
	});

	describe('charMaxSize50', () => {
		test('valid', async () => {
			const res = await validate(generateString(50), 'charMaxSize50');
			expect(res.valid).toBe(true);
		});
		test('invalid', async () => {
			const res = await validate(generateString(51), 'charMaxSize50');
			expect(res.valid).toBe(false);
		});
	});

	describe('charMaxSize255', () => {
		test('valid', async () => {
			const res = await validate(generateString(255), 'charMaxSize255');
			expect(res.valid).toBe(true);
		});
		test('invalid', async () => {
			const res = await validate(generateString(256), 'charMaxSize255');
			expect(res.valid).toBe(false);
		});
	});

	describe('charMaxSize5000', () => {
		test('valid', async () => {
			const res = await validate(generateString(5000), 'charMaxSize5000');
			expect(res.valid).toBe(true);
		});
		test('invalid', async () => {
			const res = await validate(generateString(5001), 'charMaxSize5000');
			expect(res.valid).toBe(false);
		});
	});

	describe('validNumber', () => {
		test('valid', async () => {
			const validNumbers = [
				'1',
				'999999999',
				'0',
				'-5',
				'-5555555',
				'12345',
			];
			for (const number of validNumbers) {
				const res = await validate(number, 'validNumber');
				expect(res.valid).toBe(true);
			}
		});
		test('invalid', async () => {
			const invalidNumbers = [
				'01',
				'0.99',
				'1,25',
				'0.2,5',
				'52.5',
				'-5.2',
				'-0,5',
				'01234',
			];
			for (const number of invalidNumbers) {
				const res = await validate(number, 'validNumber');
				expect(res.valid).toBe(false);
			}
		});
	});

	describe('validNumberWithDecimals', () => {
		test('valid', async () => {
			const validNumbers = [
				'1',
				'999999999',
				'0',
				'-5',
				'-5555555',
				'12345',
				'0.99',
				'0,99',
				'5.29',
				'50,29',
				'25125152,23',
				'25125152.23',
				'-25125152,23',
				'-25125152.23',
			];
			for (const number of validNumbers) {
				const res = await validate(number, 'validNumberWithDecimals');
				expect(res.valid).toBe(true);
			}
		});
		test('invalid', async () => {
			const invalidNumbers = [
				'01',
				'0.2,5',
				'52,55222',
				'52.55222',
				'01234',
				'05.5',
			];
			for (const number of invalidNumbers) {
				const res = await validate(number, 'validNumberWithDecimals');
				expect(res.valid).toBe(false);
			}
		});
	});

	describe('validPersNumber', () => {
		test('empty', async () => {
			const res = await validate('', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 1', async () => {
			const res = await validate('196005051211', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 2', async () => {
			const res = await validate('19600505-1211', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 3', async () => {
			const res = await validate('6005051211', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 4', async () => {
			const res = await validate('600505-1211', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 5 (february leap year)', async () => {
			const res = await validate('600229-1216', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 6 (samordningsnummer)', async () => {
			const res = await validate('600565-1218', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 7 (samordningsnummer)', async () => {
			const res = await validate('600561-1212', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('valid 8 (samordningsnummer)', async () => {
			const res = await validate('600591-1216', 'validPersNumber');
			expect(res.valid).toBe(true);
		});
		test('invalid 1', async () => {
			const res = await validate('600505-1201', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 2', async () => {
			const res = await validate('600505-1311', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 3', async () => {
			const res = await validate('1234567890', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 4', async () => {
			const res = await validate('abc', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 5', async () => {
			const res = await validate('1960-0505-1311', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 6', async () => {
			// remember to update this test case in 30 years :)
			const res = await validate('20520505-1211', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 7', async () => {
			const res = await validate('19010505-1211', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 8', async () => {
			const res = await validate('1960050512111', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 9 (invalid month)', async () => {
			const res = await validate('600005-1216', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 10 (invalid month)', async () => {
			const res = await validate('601305-1211', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 11 (invalid day)', async () => {
			const res = await validate('600500-1216', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 12 (invalid day)', async () => {
			const res = await validate('600532-1218', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 13 (invalid day february not leap year)', async () => {
			const res = await validate('610229-1215', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 14 (invalid day samordningsnummer)', async () => {
			const res = await validate('600560-1213', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
		test('invalid 15 (invalid day samordningsnummer)', async () => {
			const res = await validate('600592-1215', 'validPersNumber');
			expect(res.valid).toBe(false);
		});
	});

	describe('validOrgNumber', () => {
		test('empty', async () => {
			const res = await validate('', 'validOrgNumber');
			expect(res.valid).toBe(true);
		});
		describe('Enskild firma', () => {
			test('valid any', async () => {
				const res = await validate('6005051211', 'validOrgNumber:');
				expect(res.valid).toBe(true);
			});
			test('valid short', async () => {
				const res = await validate(
					'6005051211',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(true);
			});
			test('valid short dashed', async () => {
				const res = await validate(
					'600505-1211',
					'validOrgNumber:shortDash'
				);
				expect(res.valid).toBe(true);
			});
			test('valid long', async () => {
				const res = await validate(
					'196005051211',
					'validOrgNumber:long'
				);
				expect(res.valid).toBe(true);
			});
			test('valid long dashed', async () => {
				const res = await validate(
					'19600505-1211',
					'validOrgNumber:longDash'
				);
				expect(res.valid).toBe(true);
			});
			test('invalid 1', async () => {
				const res = await validate(
					'9606061760',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 2', async () => {
				const res = await validate(
					'199606061760',
					'validOrgNumber:long'
				);
				expect(res.valid).toBe(false);
			});
		});
		describe('Ej enskild firma', () => {
			test('valid any', async () => {
				const res = await validate('5567037485', 'validOrgNumber:');
				expect(res.valid).toBe(true);
			});
			test('valid short', async () => {
				const res = await validate(
					'5567037485',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(true);
			});
			test('valid short dashed', async () => {
				const res = await validate(
					'556703-7485',
					'validOrgNumber:shortDash'
				);
				expect(res.valid).toBe(true);
			});
			test('valid long', async () => {
				const res = await validate(
					'165567037485',
					'validOrgNumber:long'
				);
				expect(res.valid).toBe(true);
			});
			test('valid long dashed', async () => {
				const res = await validate(
					'16556703-7485',
					'validOrgNumber:longDash'
				);
				expect(res.valid).toBe(true);
			});
			test('invalid 1', async () => {
				const res = await validate(
					'5566778888',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 2', async () => {
				const res = await validate(
					'165566778888',
					'validOrgNumber:long'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 3', async () => {
				const res = await validate(
					'165555555555',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 4', async () => {
				const res = await validate(
					'16555555-5555',
					'validOrgNumber:short'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 5', async () => {
				const res = await validate(
					'165555555555',
					'validOrgNumber:shortDash'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 6', async () => {
				const res = await validate(
					'16555555-5555',
					'validOrgNumber:shortDash'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 7', async () => {
				const res = await validate('5555555555', 'validOrgNumber:long');
				expect(res.valid).toBe(false);
			});
			test('invalid 8', async () => {
				const res = await validate(
					'555555-5555',
					'validOrgNumber:long'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 9', async () => {
				const res = await validate(
					'5555555555',
					'validOrgNumber:longDash'
				);
				expect(res.valid).toBe(false);
			});
			test('invalid 10', async () => {
				const res = await validate(
					'555555-5555',
					'validOrgNumber:longDash'
				);
				expect(res.valid).toBe(false);
			});
		});
	});
});
