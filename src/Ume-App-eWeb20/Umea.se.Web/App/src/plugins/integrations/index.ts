import {
	AvailableIntegration,
	FormFieldType,
	IntegrationType,
} from '@/models/Enums';
import { IFormIntegrationOption } from '@/models/IForm';
import { Component } from 'vue';

export interface IIntegrationObject {
	type: IntegrationType;
	integrationType: AvailableIntegration;
	icon: string;
	componentName: string;
	fieldComponentName?: string | Component;
	fieldComponentTypes?: FormFieldType[];
	name: string;
	options: IFormIntegrationOption[];
}

declare module 'vue' {
	interface ComponentCustomProperties {
		$registeredIntegrationComponents: IIntegrationObject[];
	}
}

export default {
	install: (app: any) => {
		app.config.globalProperties.$registeredIntegrationComponents = [];

		app.provide(
			'registeredIntegrationComponents',
			app.config.globalProperties.$registeredIntegrationComponents
		);
	},
};
