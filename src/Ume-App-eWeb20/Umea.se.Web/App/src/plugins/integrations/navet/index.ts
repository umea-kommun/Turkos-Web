import { AvailableIntegration, IntegrationType } from '@/models/Enums';
import { IIntegrationObject } from '../index';
import NavetIntegration from './NavetIntegration.vue';

export default {
	install: (app: any) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.NavetFardtjanst,
			integrationType: AvailableIntegration.NavetFardtjanst,
			icon: 'airport_shuttle',
			componentName: 'NavetIntegration',
			name: 'Färdtjänst (Navet)',
		} as IIntegrationObject);

		// Register admin component
		app.component('NavetIntegration', NavetIntegration);
	},
};
