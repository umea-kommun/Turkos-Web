import { mount, config } from '@vue/test-utils';
import { describe, expect, test, beforeAll, beforeEach, vi } from 'vitest';
import FieldTextBox from '../FieldTextBox.vue';
import Validation from '@/plugins/validation';
import { I18n } from 'vue-i18n';
import Vuex from 'vuex';
import { FormMode } from '@/models/Enums';

config.global.mocks.$t = (phrase: string): string => phrase;
const $dataSourceApplier = {};

vi.mock('@/store/utils', () => ({}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getField = (): any => ({
	type: 'FieldTextBox',
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

describe('FieldTextBox', () => {
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
		const wrapper = mount(FieldTextBox, {
			props: {
				field: field,
				mode: FormMode.Edit,
			},
			global: {
				plugins: [storeMock],
				provide: { $dataSourceApplier },
			},
		});

		expect(wrapper.text()).toContain(field.title);
	});

	test('Renders in VIEW mode', async () => {
		field.title = '-title-';
		field.value = '-value-';
		const wrapper = mount(FieldTextBox, {
			props: {
				field: field,
				mode: FormMode.View,
			},
			global: {
				plugins: [storeMock],
				provide: { $dataSourceApplier },
			},
		});

		expect(wrapper.text()).toContain(field.title);
		expect(wrapper.text()).toContain(field.value);
	});

	test('Renders in PRINT mode', async () => {
		field.title = '-title-';
		const wrapper = mount(FieldTextBox, {
			props: {
				field: field,
				mode: FormMode.Print,
			},
			global: {
				plugins: [storeMock],
				provide: { $dataSourceApplier },
			},
		});

		expect(wrapper.text()).toContain(field.title);
		expect(wrapper.text()).toContain(field.helpText);
	});

	test('Test validation (using required rule in EDIT mode)', async () => {
		const wrapper = mount(FieldTextBox, {
			props: {
				field: field,
			},
			global: {
				plugins: [storeMock],
				provide: { $dataSourceApplier },
			},
		});

		const input = wrapper.find('input');

		await input.setValue('hello');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// No error since we have text
		expect(input.attributes('error')).toBe('false');

		await input.setValue('');
		await input.trigger('blur');

		// Need to wait for validation to complete
		await new Promise((r) => setTimeout(r, 50));

		// Should show an error since we don't have any text
		expect(input.attributes('error')).toBe('true');
		expect(wrapper.text()).toContain('app.validation.messages.required');
	});
});
