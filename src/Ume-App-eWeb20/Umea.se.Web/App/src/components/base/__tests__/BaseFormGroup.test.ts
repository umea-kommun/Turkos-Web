import { mount, config } from '@vue/test-utils';
import { describe, expect, test, beforeEach } from 'vitest';
import BaseFormGroup from '../BaseFormGroup.vue';

config.global.mocks.$t = (phrase: string): string => phrase;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getForms = () => [
	{
		id: '53',
		attributes: {
			title: 'Tjänst för test',
			description: 'Bla bla bla',
			status: 'Published',
			type: 'EService',
			path: 'form-2020-02-25T13:29:03924Z',
			displayRules: [],
			categories: [
				{
					title: 'Bygga & Bo',
					id: 1,
				},
			],
			pM3: {
				title: 'Omsorg',
				id: 4,
			},
			receiver: {
				title: 'Styrelsen',
				url: 'https://www.any.com/start.html',
				id: 12,
			},
			createdBy: 'test.testsson@test.se',
			created: '2020-02-25T13:29:04.4552123',
			modifiedBy: 'test.testsson@test.se',
			modified: '2020-06-09T11:56:20.0087436',
			dateSchedule: {
				from: '2020-02-26T09:22:30.0467515Z',
				to: '2020-02-26T09:22:30.0467587Z',
				active: false,
				formId: 53,
				id: 30,
			},
		},
	},
];

describe('BaseFormGroup', () => {
	let forms: any;

	beforeEach(() => {
		forms = getForms();
	});

	test('renders title and form count', async () => {
		const title = 'Test';
		const count = 3;

		const wrapper = mount(BaseFormGroup, {
			props: {
				title,
				count,
				forms: [],
			},
		});

		expect(wrapper.element.getElementsByTagName('h2')[0].innerHTML).toBe(
			title + ' (' + count + ')'
		);
	});

	test('renders form', async () => {
		const title = 'Test';
		const count = 3;

		const wrapper = mount(BaseFormGroup, {
			props: {
				title,
				count,
				forms,
			},
		});

		expect(
			wrapper.element.getElementsByTagName('h3')[0].innerHTML
		).toContain(forms[0].attributes.title);
		expect(wrapper.element.innerHTML).toContain(
			forms[0].attributes.description
		);
		forms[0].attributes.description = '<b>this</b><i>is</i><br>html';
		expect(wrapper.element.innerHTML).not.toContain(
			'forms[0].attributes.description'
		);
	});

	test('sanitizes form description', async () => {
		forms[0].attributes.description = '<b>this</b> <i>is</i> <br>html';

		const wrapper = mount(BaseFormGroup, {
			props: {
				forms,
			},
		});

		expect(wrapper.element.innerHTML).not.toContain(
			forms[0].attributes.description
		);
		expect(wrapper.element.innerHTML).toContain('this is html');
	});

	test('shortens form description', async () => {
		forms[0].attributes.description =
			// eslint-disable-next-line max-len
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
		const wrapper = mount(BaseFormGroup, {
			props: {
				forms,
			},
		});
		expect(wrapper.element.innerHTML).not.toContain(
			forms[0].attributes.description
		);
        expect(wrapper.element.innerHTML).toContain('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
	});

	test('show grid layout', async () => {
		const wrapper = mount(BaseFormGroup, {
			props: {
				forms,
			},
		});
		expect(
			wrapper.element.getElementsByClassName('grid-layout').length
		).toBe(1);
	});

	test('show list layout', async () => {
		const wrapper = mount(BaseFormGroup, {
			props: {
				forms,
				showGrid: false,
			},
		});
		expect(
			wrapper.element.getElementsByClassName('list-layout').length
		).toBe(1);
	});
});
