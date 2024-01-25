import { AvailableIntegration, IntegrationType } from '@/models/Enums';
import { IFormIntegration, IFormIntegrationTyped } from '@/models/IForm';

export const setIntegrationType = (
	integrations: IFormIntegration[]
): IFormIntegrationTyped[] => {
	/** Set integrationType for integrations, so we can differentiate onPrem integrations */

	return integrations.map((integration) => {
		if (integration.type === IntegrationType.OnPrem) {
			// OnPrem integrations get the "integrationType" from datasourcename option
			const type = integration.options.find(
				(option) => option.key === 'datasourcename'
			)?.value;
			return {
				...integration,
				integrationType: type as AvailableIntegration,
			};
		} else {
			// For non-onPrem integrations "integrationType" and "type" are the same
			return {
				...integration,
				integrationType:
					integration.type as unknown as AvailableIntegration,
			};
		}
	});
};
