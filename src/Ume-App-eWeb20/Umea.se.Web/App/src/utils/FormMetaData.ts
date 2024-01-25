// Handle meta tags dynamically as in:
// https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics#0

import { IForm } from '@/models/IForm';

interface IMetaTag {
	name: string;
	content: string;
}

const FORM_META_DATA_TYPE = 'form-meta-data';

/**
 * Clean up dynamically created meta tags
 */
export const unsetFormMetaTags = (): void => {
	const formMetaTags = document.head.querySelectorAll(
		`[data-type="${FORM_META_DATA_TYPE}"]`
	);
	formMetaTags.forEach((formMetaTag) => formMetaTag.remove());
};

/**
 * Create meta tags for e-service
 */
export const setFormMetaTags = (form: IForm): void => {
	unsetFormMetaTags();
	const metaTags: IMetaTag[] = [];

	if (form.attributes.hidden) {
		metaTags.push({ name: 'robots', content: 'noindex' });
	}

	// Create HTML meta-tags
	metaTags.forEach((metaData) => {
		const meta = document.createElement('meta');
		meta.name = metaData.name;
		meta.content = metaData.content;
		meta.setAttribute('data-type', FORM_META_DATA_TYPE);
		document.head.appendChild(meta);
	});
};
