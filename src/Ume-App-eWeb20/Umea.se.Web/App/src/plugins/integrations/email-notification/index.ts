import { AvailableIntegration, IntegrationType } from '@/models/Enums';
import { IIntegrationObject } from '../index';
import EmailNotificationIntegration from './EmailNotificationIntegration.vue';

export default {
	install: (app: any) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.EmailNotification,
			integrationType: AvailableIntegration.EmailNotification,
			icon: 'reply',
			componentName: 'EmailNotificationIntegration',
			name: 'Bekräftelsemejl',
		} as IIntegrationObject);

		// Register admin component
		app.component(
			'EmailNotificationIntegration',
			EmailNotificationIntegration
		);
	},
};
