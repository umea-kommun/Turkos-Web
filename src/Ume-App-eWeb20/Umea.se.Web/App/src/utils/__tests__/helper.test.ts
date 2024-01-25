import { AppContentSize, FormStatus } from '@/models/Enums';
import { describe, expect, test } from 'vitest';
import { Helper } from '@/utils/helper';

describe('helper', () => {
	describe('getComponentName', () => {
		test('Returns name in kebab-case', () => {
			expect(Helper.getComponentName('FieldTextBox')).toBe(
				'field-text-box'
			);
		});
	});

	describe('deepCopy', () => {
		test('Return deep copy of object', () => {
			const testObjectLevel3 = { propA: 'level3A' };
			const testObjectLevel2 = {
				propA: 'level2A',
				propB: testObjectLevel3,
			};
			const testObjectLevel1 = {
				propA: 'level1A',
				propB: testObjectLevel2,
			};

			const copy = Helper.deepCopy(testObjectLevel1);

			// Copies all they way down the hiearchy.
			expect(copy === testObjectLevel1).toBe(false); // Not the same object.
			expect(copy.propA === testObjectLevel1.propA).toBe(true); // Equal string.
			expect(copy.propB === testObjectLevel2).toBe(false); // Not the same object.
			expect(copy.propB.propA === testObjectLevel2.propA).toBe(true); // Equal string.
			expect(copy.propB.propB === testObjectLevel3).toBe(false); // Not the same object.
			expect(copy.propB.propB.propA === testObjectLevel3.propA).toBe(
				true
			); // Equal string.
		});
	});

	describe('shallowCopy', () => {
		test('Returns shallow copy of object', () => {
			const testObjectLevel3 = { propA: 'level3A' };
			const testObjectLevel2 = {
				propA: 'level2A',
				propB: testObjectLevel3,
			};
			const testObjectLevel1 = {
				propA: 'level1A',
				propB: testObjectLevel2,
			};

			const copy = Helper.shallowCopy(testObjectLevel1);

			// Copy of top level object, but sub objects are the same (referential equality).
			expect(copy === testObjectLevel1).toBe(false); // Not the same object.
			expect(copy.propA === testObjectLevel1.propA).toBe(true); // Equal string.
			expect(copy.propB === testObjectLevel2).toBe(true); // Same object.
			expect(copy.propB.propA === testObjectLevel2.propA).toBe(true); // Equal string.
			expect(copy.propB.propB === testObjectLevel3).toBe(true); // Same object.
			expect(copy.propB.propB.propA === testObjectLevel3.propA).toBe(
				true
			); // Equal string.
		});
	});

	describe('generateTempId', () => {
		test('Returns string with integer less than 0', () => {
			const idString: string = Helper.generateTempId();
			const idInteger: number = Number(idString);
			expect(idInteger).toBeLessThan(0);
		});
	});

	describe('generateTempId', () => {
		test('Returns integer less than 0', () => {
			const id: number = Helper.generateTempIdInteger();
			expect(id).toBeLessThan(0);
		});
	});

	describe('generateUuid', () => {
		test('Returns UUID in valid format', () => {
			const uuid = Helper.generateUuid();
			const regex =
				/^[0-9a-f]{8}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{4}\b-[0-9a-f]{12}$/;
			expect(regex.test(uuid)).toBe(true);
		});
	});

	describe('getStatus', () => {
		test('Returns correct status settings for status Draft', () => {
			const result = Helper.getStatus(FormStatus.Draft);
			expect(result.statusColorBg).toBe('warning');
			expect(result.statusColorText).toBe('black');
		});

		test('Returns correct status settings for status Published', () => {
			const result = Helper.getStatus(FormStatus.Published);
			expect(result.statusColorBg).toBe('success');
			expect(result.statusColorText).toBe('black');
		});

		test('Returns correct status settings for status Unpublished', () => {
			const result = Helper.getStatus(FormStatus.Unpublished);
			expect(result.statusColorBg).toBe('error');
			expect(result.statusColorText).toBe('black');
		});
	});

	describe('getSizeClasses', () => {
		test('Return correct size classes for AppContentSize.Default', () => {
			expect(Helper.getSizeClasses(AppContentSize.Default)).toBe(
				'v-col-12 v-col-sm-10 v-col-md-9 v-col-lg-7'
			);
		});

		test('Return correct size classes for AppContentSize.Wide', () => {
			expect(Helper.getSizeClasses(AppContentSize.Wide)).toBe(
				'v-col-12 v-col-md-11 v-col-lg-10 v-col-xl-9'
			);
		});
	});

	describe('sortByTitle', () => {
		test('Sorts correctly (ascending, case insensitive)', () => {
			const objectA = { title: 'abc' };
			const objectB = { title: 'def' };
			const objectC = { title: 'ABC' };

			expect(Helper.sortByTitle(objectA, objectB)).toBe(-1);
			expect(Helper.sortByTitle(objectB, objectA)).toBe(1);
			expect(Helper.sortByTitle(objectA, objectC)).toBe(0);
		});
	});
});
