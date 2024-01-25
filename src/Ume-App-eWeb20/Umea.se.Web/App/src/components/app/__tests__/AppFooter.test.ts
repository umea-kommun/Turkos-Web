import { mount, config } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import AppFooter from '../AppFooter.vue';

config.global.mocks.$t = (phrase: string): string => phrase;

describe('AppFooter', () => {
	test('Text is inside footer (example test)', () => {
		const wrapper = mount(AppFooter);

		expect(wrapper.text()).toContain('component.appFooter.byLine');
	});
});