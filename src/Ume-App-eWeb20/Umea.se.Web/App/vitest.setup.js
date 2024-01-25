import { config } from '@vue/test-utils';

const TEMPLATE_BUTTON = { template: '<button><slot /></button>' };
const TEMPLATE_DIV = { template: '<div><slot /></div>' };
const TEMPLATE_I = { template: '<i />' };
const TEMPLATE_INPUT = { template: '<input />' };
const TEMPLATE_LINK = { template: '<a><slot /></a>' };
const TEMPLATE_MAIN = { template: '<main><slot /></main>' };

// Define global stubs for vuetify fields (v-col will be replaced by div etc.)
config.global.stubs['router-link'] = TEMPLATE_LINK;
config.global.stubs['v-alert'] = TEMPLATE_DIV;
config.global.stubs['v-btn-toggle'] = TEMPLATE_BUTTON;
config.global.stubs['v-btn'] = TEMPLATE_BUTTON;
config.global.stubs['v-card-text'] = TEMPLATE_DIV;
config.global.stubs['v-card'] = TEMPLATE_DIV;
config.global.stubs['v-col'] = TEMPLATE_DIV;
config.global.stubs['v-container'] = TEMPLATE_DIV;
config.global.stubs['v-divider'] = TEMPLATE_DIV;
config.global.stubs['v-icon'] = TEMPLATE_I;
config.global.stubs['v-layout'] = TEMPLATE_DIV;
config.global.stubs['v-list-item-action'] = TEMPLATE_DIV;
config.global.stubs['v-list-item-subtitle'] = TEMPLATE_DIV;
config.global.stubs['v-list-item-title'] = TEMPLATE_DIV;
config.global.stubs['v-list-item'] = TEMPLATE_DIV;
config.global.stubs['v-list'] = TEMPLATE_DIV;
config.global.stubs['v-main'] = TEMPLATE_MAIN;
config.global.stubs['v-menu'] = TEMPLATE_DIV;
config.global.stubs['v-progress-circular'] = TEMPLATE_DIV;
config.global.stubs['v-snackbar'] = TEMPLATE_DIV;
config.global.stubs['v-spacer'] = TEMPLATE_DIV;
config.global.stubs['v-text-field'] = TEMPLATE_INPUT;
config.global.stubs['ume-text-field'] = TEMPLATE_INPUT;
config.global.stubs['t-date-picker'] = TEMPLATE_INPUT;

global.crypto = {
	getRandomValues: (arr) => require('crypto').randomBytes(arr.length),
};

// Define global stubs for other components.
config.global.stubs['base-login-methods'] = TEMPLATE_DIV;

config.global.mocks = {
	$t: (tKey) => tKey, // just return translation key
};
