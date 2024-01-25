import Config from '@/utils/Config';
import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
import sv from '@/locales/sv.json';
import en from '@/locales/en.json';

/**
 * Translation plugin using VueI18n https://kazupon.github.io/vue-i18n
 */

function loadLocaleMessages(): LocaleMessages<VueMessageType> {
	const messages: LocaleMessages<VueMessageType> = {
		sv,
		en,
	};
	return messages;
}

const i18n = createI18n({
	locale: Config.VUE_APP_I18N_LOCALE,
	fallbackLocale: Config.VUE_APP_I18N_FALLBACK_LOCALE,
	messages: loadLocaleMessages(),
	silentTranslationWarn: true,
});

export default i18n;
