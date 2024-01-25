import { mount, config } from '@vue/test-utils';
import { describe, expect, test, beforeAll, beforeEach, vi } from 'vitest';
import TableObject from '../TableObject.vue';
import Validation from '@/plugins/validation';
import { I18n } from 'vue-i18n';
import { FormMode } from '@/models/Enums';
import { ITableColumn, ITableField } from '@/models/IForm';

config.global.mocks.$t = (phrase: string): string => phrase;

vi.mock('@/store/utils', () => ({}));

const getField = (): Partial<ITableField> => ({
	type: 'FieldTable',
	title: 'Table title',
	value: '',
	helpText: 'help text',
	sortIndex: 8,
	fieldOptions: {
		minRows: 1,
		maxRows: 5,
		autofillNumberOfRows: false,
		rowDisplay: 'objectContainer',
		objectName: 'obj',
		dataSourceData: {},
	},
	guid: 'd711c458-67fe-4675-ad0c-d61090d9e8fe',
	displayRuleAnother: false,
	displayRuleMultipleLegitimation: false,
	id: '3897',
});

describe('TableObject', () => {
	let field: ITableField;

	beforeAll(() => {
		const i18n = { global: { t: (t: string) => t } };
		Validation(i18n as I18n);
	});

	beforeEach(() => {
		// Reset field before each test
		field = getField() as ITableField;
	});

	test('Field in table gets correct id that vee validate supports', async () => {
		const wrapper = mount(TableObject, {
			props: {
				field: field,
				mode: FormMode.Edit,
				stepId: '1',
				tableRows: [
					{
						guid: 'rowGuid',
						columns: [
							{
								fieldGuid: 'fieldGuid',
								isItem: false,
								value: '',
							} as ITableColumn,
						],
					},
				],
				tableFields: [
					{
						type: 'FieldTextBox',
						title: 'FieldTitle',
						guid: 'fieldGuid',
						value: '',
						helpText: '',
						fieldOptions: {},
						id: '2',
					} as never,
				],
			} as never,
		});

		wrapper.find('button').trigger('click');

		// Wait for rerender
		await new Promise((r) => setTimeout(r));

		const input = wrapper.find('input');
		expect(input).not.toBe(null);
		expect(input.attributes('id')).toBe('1.2.1-rowGuid-fieldGuid');
	});
});
