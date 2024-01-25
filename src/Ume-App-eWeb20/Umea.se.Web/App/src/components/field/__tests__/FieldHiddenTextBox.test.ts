import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import FieldHiddenTextBox from '../FieldHiddenTextBox.vue';
import Vuex from 'vuex';
import { FormMode } from '@/models/Enums';

const getField = (): any => ({
	type: 'FieldHiddenTextBox',
	title: 'Detta är det dolda fältet',
	value: '',
	helpText: '-helptext-',
	fieldOptions: {
		dataSource: {
			dataSourceName: 'AzureActiveDirectory',
			options: { itemProperty: 'jobTitle' },
		},
		showToUser: true,
	},
	id: 2022,
});

describe('FieldHiddenTextBox', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let field: any;
	let mutations: any;
	let storeMock: any;

	beforeEach(() => {
		// Reset field before each test
		field = getField();
		mutations = {
			updateFormField: vi.fn(), //MutationType.UpdateFormField
		};
		storeMock = new Vuex.Store({ mutations });
	});

	test('Renders in EDIT mode', async () => {
		field.fieldOptions = {
			showToUser: true
		};
		const wrapper = mount(FieldHiddenTextBox, {
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
		field.value = '-value-';
		const wrapper = mount(FieldHiddenTextBox, {
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

	test('Renders in PRINT mode (if showToUser)', async () => {
		field.title = '-title-';
		const wrapper = mount(FieldHiddenTextBox, {
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

	test('Doesnt render in PRINT mode (if not showToUser)', async () => {
		field.title = '-title-';
		field.fieldOptions.showToUser = false;
		const wrapper = mount(FieldHiddenTextBox, {
			props: {
				field: field,
				mode: FormMode.Print,
			},
			global: {
				plugins: [storeMock],
			},
		});

		expect(wrapper.text()).not.toContain(field.title);
		expect(wrapper.text()).not.toContain(field.helpText);
	});

	
});
