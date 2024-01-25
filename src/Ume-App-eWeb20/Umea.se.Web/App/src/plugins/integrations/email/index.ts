import { AvailableIntegration, IntegrationType } from '@/models/Enums';
import { IIntegrationObject } from '../index';
import EmailIntegration from './EmailIntegration.vue';

export default {
	install: (app: any) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.Email,
			integrationType: AvailableIntegration.Email,
			icon: 'mail_outline',
			componentName: 'EmailIntegration',
			name: 'E-mail',
		} as IIntegrationObject);

		// Register admin component
		app.component('EmailIntegration', EmailIntegration);
	},
};
