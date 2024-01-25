import { mount } from '@vue/test-utils';
import { describe, expect, test, beforeAll, beforeEach } from 'vitest';
import { useFieldValidation } from '../FieldValidation';
import Validation from '@/plugins/validation';
import { I18n } from 'vue-i18n';
import { ref } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getField = (): any => ({
	type: 'FieldTextBox',
	title: 'FieldTitle',
	value: '',
	helpText: 'This is a help text',
	fieldOptions: {},
	id: '2222',
});

describe('useFieldValidation', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let field: any;

	beforeAll(() => {
		const i18n = { global: { t: (t: string) => t } };
		Validation(i18n as I18n);
	});

	beforeEach(() => {
		// Reset field before each test
		field = getField();
	});

	test('Validation id', async () => {
		const id = ref(field.id);

		const { getValidationId } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions: field.fieldOptions,
			id,
		});

		expect(getValidationId.value).toBe('3333.2222.1111');
	});

	test('Validation Rules - one rule', async () => {
		const id = ref(field.id);
		field.fieldOptions.validation = [
			{
				title: 'Only numbers',
				type: 'numeric',
				value: '',
				requiresValue: false,
			},
		];
		const fieldOptions = ref(field.fieldOptions);

		const { validationRules } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(validationRules.value).toBe('numeric');
	});

	test('Validation Rules - multiple rules', async () => {
		const id = ref(field.id);
		field.fieldOptions.validation = [
			{
				title: 'Required field',
				type: 'required',
				value: '',
				requiresValue: false,
			},
			{
				title: 'Only numbers',
				type: 'numeric',
				value: '',
				requiresValue: false,
			},
		];
		const fieldOptions = ref(field.fieldOptions);

		const { validationRules } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(validationRules.value).toBe('required|numeric');
	});

	test('Validation Rules - no rules', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { validationRules } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(validationRules.value).toBe('');
	});

	test('isRequired - true', async () => {
		const id = ref(field.id);
		field.fieldOptions.validation = [
			{
				title: 'Required field',
				type: 'required',
				value: '',
				requiresValue: false,
			},
		];
		const fieldOptions = ref(field.fieldOptions);

		const { isRequired } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(isRequired.value).toBe(true);
	});

	test('isRequired - false', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { isRequired } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(isRequired.value).toBe(false);
	});

	test('readOnly - true', async () => {
		const id = ref(field.id);
		field.fieldOptions.readOnly = true;
		const fieldOptions = ref(field.fieldOptions);

		const { readOnly } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(readOnly.value).toBe(true);
	});

	test('readOnly - false', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { readOnly } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		expect(readOnly.value).toBe(false);
	});

	test('isSuccess - true', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { isSuccess } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		const meta = {
			touched: true,
			valid: true,
			dirty: true,
			validated: true,
			pending: false,
		};

		expect(isSuccess(meta)).toBe(true);
	});

	test('isSuccess - false', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { isSuccess } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		const meta = {
			touched: true,
			valid: false,
			dirty: true,
			validated: true,
			pending: false,
		};

		expect(isSuccess(meta)).toBe(false);
	});

	test('getValidationIcon - success', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { getValidationIcon } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		const meta = {
			touched: true,
			valid: true,
			dirty: true,
			validated: true,
			pending: false,
		};

		expect(getValidationIcon(meta, [])).toBe('check_circle');
	});

	test('getValidationIcon - errors', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { getValidationIcon } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		const meta = {
			touched: true,
			valid: false,
			dirty: true,
			validated: true,
			pending: false,
		};

		expect(getValidationIcon(meta, ['error'])).toBe('warning');
	});

	test('getValidationIcon - not validated', async () => {
		const id = ref(field.id);
		const fieldOptions = ref(field.fieldOptions);

		const { getValidationIcon } = useFieldValidation({
			validationId: '1111',
			validationScope: '3333',
			fieldOptions,
			id,
		});

		const meta = {
			touched: false,
			valid: false,
			dirty: false,
			validated: false,
			pending: false,
		};

		expect(getValidationIcon(meta, [])).toBe('');
	});
});
