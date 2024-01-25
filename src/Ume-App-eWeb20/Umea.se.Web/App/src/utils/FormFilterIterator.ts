/* eslint-disable @typescript-eslint/no-explicit-any */
import { IGdpr, IFormIntegration, IForm } from '@/models/IForm';

export default class FormFilterIterator {
	private filterConfig: any = {};
	private forms: IForm[] = [];
	private index = -1;

	constructor(forms: IForm[], filterConfig: any) {
		this.filterConfig = filterConfig;
		this.forms = forms;
	}

	public next(): IForm | null {
		this.index++;
		if (this.forms[this.index]) {
			if (this.passesAllFilters(this.forms[this.index])) {
				return this.forms[this.index];
			} else {
				return this.next();
			}
		}
		return null;
	}

	private passesAllFilters(form: IForm): boolean {
		return (
			this.passesGdprFilter(form) &&
			this.passesIntegrationFilter(form) &&
			this.passesPm3Filter(form) &&
			this.passesReceiverFilter(form) &&
			this.passesSearchFilter(form)
		);
	}

	private passesReceiverFilter(form: IForm): boolean {
		if (this.filterConfig.receivers.length) {
			const receiverId = (form.attributes.receiver || ({} as any)).id;
			return this.filterConfig.receivers.indexOf(receiverId) > -1;
		}
		return true;
	}

	private passesGdprFilter(form: IForm): boolean {
		if (this.filterConfig.gDprs.length) {
			return (form.attributes.gDPR.dataControllers || []).some(
				(gdpr: IGdpr) => {
					return this.filterConfig.gDprs.indexOf(gdpr.id) > -1;
				}
			);
		}
		return true;
	}

	private passesPm3Filter(form: IForm): boolean {
		if (this.filterConfig.pm3s.length) {
			const pm3Id = (form.attributes.pM3 || ({} as any)).id;
			return this.filterConfig.pm3s.indexOf(pm3Id) > -1;
		}
		return true;
	}

	private passesIntegrationFilter(form: IForm): boolean {
		if (this.filterConfig.integrations.length) {
			return (form.attributes.integrations || []).some(
				(integration: IFormIntegration) => {
					return (
						this.filterConfig.integrations.indexOf(
							integration.type
						) > -1
					);
				}
			);
		}
		return true;
	}

	private passesSearchFilter(form: IForm): boolean {
		if (!this.filterConfig.search.length) {
			return true;
		}

		const search = (this.filterConfig.search as string).toLowerCase();
		const title = form.attributes.title.toLowerCase();

		return title.includes(search) || form.id.includes(search);
	}
}
