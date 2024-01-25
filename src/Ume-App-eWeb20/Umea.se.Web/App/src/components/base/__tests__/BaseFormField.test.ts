import { mount, config } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import BaseFormField from '../BaseFormField.vue';

config.global.mocks.$t = (phrase: string): string => phrase;

describe('BaseFormField', () => {
	test('Renders small title', async () => {
		const wrapper = mount(BaseFormField, {
			props: {
				label: 'hello',
				labelFor: 'test',
			},
			slots: {
				default: '<input id="test" />',
			},
		});

		expect(wrapper.text()).toBe('hello');
	});

	test('Renders small title and asterisk if required field', async () => {
		const wrapper = mount(BaseFormField, {
			props: {
				label: 'hello',
				labelFor: 'test',
				isRequired: true,
			},
			slots: {
				default: '<input id="test" />',
			},
		});

		expect(wrapper.text()).toBe('hello *');
	});
});
