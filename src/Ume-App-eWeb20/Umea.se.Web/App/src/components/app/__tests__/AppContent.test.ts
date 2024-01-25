import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import AppContent from '../AppContent.vue';

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (translationKey: string) => translationKey,
	}),
}));

describe('AppContent', () => {
	test('Renders slot', () => {
		const wrapper = mount(AppContent, {
			slots: {
				default: '<span>slot content</span>',
			},
		});

		expect(wrapper.text()).toContain('slot content');
	});
	test('Renders error message', () => {
		const wrapper = mount(AppContent, {
			props: {
				errorMessage: 'error message',
			},
			slots: {
				default: '<span>slot content</span>',
			},
		});

		expect(wrapper.text()).toContain('error message');
		expect(wrapper.text()).not.toContain('slot content');
	});
	test('Renders loading spinner', () => {
		const wrapper = mount(AppContent, {
			props: {
				isLoading: true,
			},
			slots: {
				default: '<span>slot content</span>',
			},
		});

		expect(wrapper.find('.app-loading-spinner').exists()).toBe(true);
	});
});
