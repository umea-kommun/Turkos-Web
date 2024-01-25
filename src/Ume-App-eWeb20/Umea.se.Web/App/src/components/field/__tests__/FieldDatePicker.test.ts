import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeAll, beforeEach, vi } from 'vitest';
import FieldDatePicker from '../FieldDatePicker.vue';
import Validation from '@/plugins/validation';
import { I18n } from 'vue-i18n';
import Vuex from 'vuex';
import { FormMode, ValidationRuleType } from '@/models/Enums';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getField = (): any => ({
	type: 'FieldDatePicker',
	title: 'FieldTitle',
	value: '',
	helpText: 'This is a help text',
	fieldOptions: {
		validation: [
			{
				title: 'Obligatoriskt fält',
				type: 'required',
				value: '',
				requiresValue: false,
			},
		],
	},

	id: '10033',
});

describe('FieldDatePicker', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let field: any;
	let mutations: any;
	let storeMock: any;

	beforeAll(() => {
		const i18n = { global: { t: (t: string) => t } };
		Validation(i18n as I18n);
	});

	beforeEach(() => {
		// Reset field before each test
		field = getField();
		mutations = {
			updateFormField2: vi.fn(), //MutationType.UpdateFormField
		};
		storeMock = new Vuex.Store({ mutations });
	});

	test('Renders in EDIT mode', async () => {
		field.fieldOptions = {};
		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
				mode: FormMode.Edit,
			},
			global: {
				plugins: [storeMock],
			},
		});

		expect(wrapper.text()).toContain(field.title);
	});

	test('Renders in VIEW mode', async () => {
		field.title = '-title-';
		field.value = '2022-11-11';
		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
				mode: FormMode.View,
			},
			global: {
				plugins: [storeMock],
			},
		});

		expect(wrapper.text()).toContain(field.title);
		expect(wrapper.text()).toContain(field.value);
	});

	test('Renders in PRINT mode', async () => {
		field.title = '-title-';
		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
				mode: FormMode.Print,
			},
			global: {
				plugins: [storeMock],
			},
		});

		expect(wrapper.text()).toContain(field.title);
		expect(wrapper.text()).toContain(field.helpText);
	});

	test('Test validation (using required rule in EDIT mode)', async () => {
		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
			},
			global: {
				plugins: [storeMock],
			},
		});

		const input = wrapper.find('input');

		await input.setValue('2022-09-12');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// No error since we have date
		expect(input.attributes('error')).toBe('false');

		await input.setValue('');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// Should show an error since we don't have any text
		expect(input.attributes('error')).toBe('true');
		expect(wrapper.html()).toContain('app.validation.messages.required');
	});

	test('Test validation - should not accept non existing date', async () => {
		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
			},
			global: {
				plugins: [storeMock],
			},
		});

		const input = wrapper.find('input');

		await input.setValue('2020-02-29'); // 29th feb exists in 2020
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// No error since we have date
		expect(input.attributes('error')).toBe('false');

		await input.setValue('2022-02-29'); // 29th feb doesn't exist in 2022
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// Should show an error since the date doesn't exist
		expect(input.attributes('error')).toBe('true');
		expect(wrapper.html()).toContain('app.validation.messages.validDate');
	});

	test('Test validation - should not accept date before min-date', async () => {
		field.fieldOptions.validation[0].type = ValidationRuleType.MinDate;
		field.fieldOptions.validation[0].value = '2022-11-23';

		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
			},
			global: {
				plugins: [storeMock],
			},
		});

		const input = wrapper.find('input');

		await input.setValue('2022-11-30');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// No error since we have date
		expect(input.attributes('error')).toBe('false');

		await input.setValue('2022-11-10');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// Should show an error since the date is before min date
		expect(input.attributes('error')).toBe('true');
		expect(wrapper.html()).toContain('app.validation.messages.minDate');
	});

	test('Test validation - should not accept date after max-date', async () => {
		field.fieldOptions.validation[0].type = ValidationRuleType.MaxDate;
		field.fieldOptions.validation[0].value = '2022-11-23';

		const wrapper = mount(FieldDatePicker, {
			props: {
				field: field,
			},
			global: {
				plugins: [storeMock],
			},
		});

		const input = wrapper.find('input');

		await input.setValue('2000-11-20');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// No error since we have date
		expect(input.attributes('error')).toBe('false');

		await input.setValue('2025-11-25');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// Should show an error since the date is after max date
		expect(input.attributes('error')).toBe('true');
		expect(wrapper.html()).toContain('app.validation.messages.maxDate');
	});
});
