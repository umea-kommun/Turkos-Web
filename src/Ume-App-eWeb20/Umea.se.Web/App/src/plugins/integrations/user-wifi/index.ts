/* eslint-disable @typescript-eslint/no-explicit-any */
import { IIntegrationObject } from '../index';
import UserWifiIntegration from './UserWifiIntegration.vue';
import UserWifiFieldIntegration from './UserWifiFieldIntegration.vue';
import {
	AvailableIntegration,
	FormFieldType,
	IntegrationType,
} from '@/models/Enums';

export default {
	install: (app: any) => {
		// register the available integration
		app.config.globalProperties.$registeredIntegrationComponents.push({
			type: IntegrationType.OnPrem,
			integrationType: AvailableIntegration.UserWifiConnections,
			icon: 'wifi',
			componentName: 'UserWifiIntegration',
			fieldComponentName: 'UserWifiFieldIntegration',
			fieldComponentTypes: [
				FormFieldType.PersonalNumber,
				FormFieldType.TextBox,
				FormFieldType.TextArea,
				FormFieldType.Table,
			],
			name: 'Elev WiFi',
		} as IIntegrationObject);

		// Register admin component
		app.component('UserWifiIntegration', UserWifiIntegration);
		// Register field component
		app.component('UserWifiFieldIntegration', UserWifiFieldIntegration);
	},
};
