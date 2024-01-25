import { mount, config } from '@vue/test-utils';
import { describe, expect, test, vi, beforeAll, beforeEach } from 'vitest';
import AppHeader from '../AppHeader.vue';
import { createI18n } from 'vue-i18n';
import { createStore } from 'vuex';
config.global.mocks.$t = (phrase: string): string => phrase;

vi.mock('vue-router', () => {
	return {
		useRoute: () => ({ name: 'test' }),
		useRouter: () => ({ hmm: 'wow' }),
	};
});

vi.mock('vue-i18n', () => ({
	useI18n: () => ({
		t: (translationKey: string) => translationKey,
	}),
	createI18n: () => ({}),
}));

describe('AppHeader', () => {
	let i18n: any;
	let storeMock: any;

	beforeAll(() => {
		i18n = createI18n({
			messages: {
				gb: {},
				'en-US': {
					'app.auth.logIn': 'app.auth.logIn',
					'app.nav.close': 'app.nav.close',
					'app.nav.skipToContent': 'app.nav.skipToContent',
					'component.appHeader.appName':
						'component.appHeader.appName',
					'component.appHeader.menu.about':
						'component.appHeader.menu.about',
					'component.appHeader.menu.allServices':
						'component.appHeader.menu.allServices',
					'component.appHeader.menu.errorReport':
						'component.appHeader.menu.errorReport',
					'component.cookieBanner.title':
						'component.cookieBanner.title',
					'component.cookieBanner.urlText':
						'component.cookieBanner.urlText',
					'component.cookieBanner.button':
						'component.cookieBanner.button',
				},
			},
		});
	});

	beforeEach(() => {
		storeMock = createStore({
			state: {
				user: {
					isAuthenticated: false,
				},
			},
		});
	});

	test('Renders skip to content link', () => {
		const wrapper = mount(AppHeader, {
			global: {
				plugins: [storeMock],
			},
		});

		expect(wrapper.find('a[href=#main-content]').text()).toBe(
			'app.nav.skipToContent'
		);
	});
});
