import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import BaseToggleContainer from '../BaseToggleContainer.vue';

describe('BaseToggleContainer', () => {
	test('Press button to toggle content', async () => {
		const wrapper = mount(BaseToggleContainer, {
			props: {
				containerId: 'test',
			},
			slots: {
				default: '<i class="test-visible">-Visible when expanded-</i>',
			},
		});

		// Not rendered initially
		expect(wrapper.find('#test').exists()).toBe(false);
		await wrapper.find('.wrap-btn').trigger('click');

		// Visible after press
		expect(wrapper.find('#test').isVisible()).toBe(true);

		await wrapper.find('.wrap-btn').trigger('click');
		
		// Hidden after press again
		expect(wrapper.find('#test').attributes('style')).toContain('display: none');
	});

	test('Test default open', async () => {
		const wrapper = mount(BaseToggleContainer, {
			props: {
				containerId: 'test',
				defaultOpen: true,
				rememberUserToggle: false,
			},
			slots: {
				default: '<i class="test-visible">-Visible when expanded-</i>',
			},
		});

		// Visible initially
		expect(wrapper.find('i.test-visible').exists()).toBe(true);
	});
});
