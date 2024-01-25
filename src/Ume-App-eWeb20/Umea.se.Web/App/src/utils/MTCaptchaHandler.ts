import Config from '@/utils/Config';
import store from '@/store/store';
import { MutationType } from '@/models/Enums';
import ErrorService from './ErrorService';

interface Window {
	mtcaptchaConfig?: {
		renderQueue: string[];
		[key: string]: string[] | object | string;
	};
	mtcaptcha?: {
		getVerifiedToken: () => string;
	};
}

const isMocked = (Config.VUE_APP_MOCK_DATA || '').trim() === 'yes';
export default class MTCaptchaHandler {
	public static renderCaptchaOnload(): void {
		if (!Config.VUE_APP_MTCAPTCHA_SITE_KEY && isMocked) {
			console.warn(
				'No MT-Captcha site key was provided, MT-Captcha is now disabled since we are using mocked data.'
			);
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			mtVerifiedCallback({ isVerified: true });
			return;
		}
		(window as Window).mtcaptchaConfig?.renderQueue?.push('Mt-Captcha');
	}

	public static getMTCaptchaToken(): string | undefined {
		try {
			const credentials = {
				verifiedtoken: (window as Window).mtcaptcha?.getVerifiedToken(),
			};
			return credentials.verifiedtoken;
		} catch (error) {
			console.dir(error);
			this.renderCaptchaOnload();
		}
	}
}

function mtJSloadedCallback(): void {
	//
}

function mtRenderedCallback(): void {
	store.commit(MutationType.SetMTCaptchaIsTriggered, true);
}

function mtVerifiedCallback(state: { isVerified: boolean }): void {
	if (state.isVerified) {
		store.commit(MutationType.SetMTCaptchaIsVerified, true);
	}
}

function mtVerifyExpiredCallback(): void {
	store.commit(MutationType.SetMTCaptchaIsVerified, false);
}

function mtErrorCallback(err: any): void {
	ErrorService.onError({ err });
}

// MtCaptcha, hur den ska se ut på webben
(window as Window).mtcaptchaConfig = {
	sitekey: Config.VUE_APP_MTCAPTCHA_SITE_KEY,
	// widgetSize: 'mini',
	theme: 'overcast',
	render: 'explicit',
	renderQueue: [],
	loadAnimation: 'false',
	'jsloaded-callback': mtJSloadedCallback,
	'rendered-callback': mtRenderedCallback,
	'verified-callback': mtVerifiedCallback,
	'verifyexpired-callback': mtVerifyExpiredCallback,
	'error-callback': mtErrorCallback,
	lang: 'sv',
	customStyle: {
		cardShadowColor: 'rgba(89,89,89,1)',
		cardBorder: 'solid #5C5C5C',
		placeHolderColor: '#707070',
		inputTextColor: '#000000',
		invalidMsgTextColor: '#E91916',
		msgTextFont: 'Calibri,Candara,Segoe,Segoe UI,Optima,Arial,sans-serif',
		inputBorderColor: {
			hover: '#3C7E0D',
		},
		buttonIconColor: {
			refresh: '#707070',
			verify: '#707070',
			success: '#006E1E',
			fail: '#E91916',
			audio: '#707070',
			audiofocus: '#006E1E',
		},
	},
};

(() => {
	// tslint:disable-next-line:variable-name
	const mt_service = document.createElement('script');
	mt_service.async = true;
	mt_service.src =
		'https://service.mtcaptcha.com/mtcv1/client/mtcaptcha.min.js';
	(
		document.getElementsByTagName('head')[0] ||
		document.getElementsByTagName('body')[0]
	).appendChild(mt_service);
	// tslint:disable-next-line:variable-name
	const mt_service2 = document.createElement('script');
	mt_service2.async = true;
	mt_service2.src =
		'https://service2.mtcaptcha.com/mtcv1/client/mtcaptcha2.min.js';
	(
		document.getElementsByTagName('head')[0] ||
		document.getElementsByTagName('body')[0]
	).appendChild(mt_service2);
})();
