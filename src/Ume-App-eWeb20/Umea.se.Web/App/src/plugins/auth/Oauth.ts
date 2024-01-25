import { IUser } from '@/models/IForm';
import { b64DecodeUnicode } from './index';
import { MutationType } from '@/models/Enums';
import Axios from 'axios';
import store from '@/store/store';
import IAuthManager from './IAuthManager';
import AuthConfig from './AuthConfig';
import IAuthClientConfig from './IAuthClientConfig';

class Oauth implements IAuthManager {
	private config: AuthConfig;

	public constructor(config: AuthConfig) {
		this.config = config;
	}

	public loginCitizen(
		routeAfterLogin: string,
		authClientName: string[]
	): string {
		return this.login(
			routeAfterLogin,
			this.config.publicScope,
			authClientName
		);
	}

	public loginAdmin(routeAfterLogin: string): void {
		this.login(routeAfterLogin, this.config.adminScope);
	}

	public getAllClientsConfig(): IAuthClientConfig[] {
		return this.config.getAllClientsConfig();
	}

	public getAuthClientsUsedForCitizenLogin(): Array<{
		displayName: string;
		name: string;
	}> {
		return this.config.getPublicAuthClientConfigs().map((config) => {
			return {
				displayName: config.clientDisplayName,
				name: config.clientName,
			};
		});
	}

	public getAuthClientLogo(authClientName: string): string {
		return this.config.getClientConfigByName(authClientName).clientLogo;
	}

	public getDefaultAuthClientUsedForCitizenLogin(): string {
		return this.config.getPublicAuthClientConfigs()[0].clientName;
	}

	public logoutRedirectingToStartPage(
		authClientName?: string,
		extraQueryParams: string = ''
	): void {
		let urlAfterLogout = window.location.origin;
		urlAfterLogout +=
			extraQueryParams === '' ? '/' : '/?' + extraQueryParams;
		this.logoutUser(urlAfterLogout, authClientName);
	}

	public logout(routeAfterLogin: string, authClientName?: string): void {
		this.logoutUser(
			window.location.origin + routeAfterLogin,
			authClientName
		);
	}

	public async handleLoginCallbackAsync(
		state: string,
		code: string
	): Promise<string> {
		if (!code) {
			throw new Error('No code supplied');
		}

		// Validate that we have come back with the same state as when we started
		// the login process(to prevent cross site forgery)
		const storedState = window.localStorage.getItem('OauthState');
		if (storedState !== state) {
			throw new Error('State not known...');
		}

		// extract state data
		const stateData = JSON.parse(b64DecodeUnicode(state)) as IStateData;

		// Build API request
		let clientConfig: IAuthClientConfig;
		try {
			clientConfig = this.config.getClientConfigByName(
				stateData.authClientName
			);
		} catch {
			clientConfig = this.config.getClientConfigByScope(stateData.scope);
		}
		const data = new FormData();
		data.append('client_id', clientConfig.clientId);
		data.append('client_secret', clientConfig.clientSecret);
		data.append('grant_type', 'authorization_code');
		data.append('redirect_uri', clientConfig.redirectUrl);
		data.append('code', code);

		let response: any;
		try {
			response = await Axios.post(
				// eslint-disable-next-line @typescript-eslint/no-use-before-define
				buildUrl(clientConfig.authorityUrl, '/connect/token'),
				data,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
		} catch (err) {
			throw new Error(
				'Got unexpected response from server when trying to fetch auth token'
			);
		}

		// parse jwt and send payload to store
		const rawJwt = response.data.access_token;
		const jwtPayload = JSON.parse(
			b64DecodeUnicode(rawJwt.split('.')[1])
		) as IUser;
		store.commit(MutationType.UserLogIn, {
			jwtPayload,
			rawJwt,
			authClientName: clientConfig.clientName,
		});
		store.commit(MutationType.UserEnterPage, { userId: stateData.userId });
		return stateData.routeAfterLogin;
	}

	private logoutUser(urlAfterLogout: string, authClientName?: string): void {
		store.commit(MutationType.UserLogOut);
		const authClientConfig = authClientName
			? this.config.getClientConfigByName(authClientName)
			: this.config.getAdminClientConfig();
		window.location.replace(
			authClientConfig.logoutUrl +
				'?redirect=' +
				encodeURIComponent(urlAfterLogout)
		);
	}

	private login(
		routeAfterLogin: string,
		scope: string,
		authClientName: any = null
	): string {
		const clientConfig: IAuthClientConfig[] = [];
		if (scope === this.config.adminScope) {
			clientConfig.push(this.config.getAdminClientConfig());
		} else if (authClientName && Array.isArray(authClientName)) {
			authClientName.forEach((element) => {
				clientConfig.push(this.config.getClientConfigByName(element));
			});
		} else if (authClientName && !Array.isArray(authClientName)) {
			clientConfig.push(
				this.config.getClientConfigByName(authClientName)
			);
		} else {
			clientConfig.push(
				this.config.getClientConfigByName(
					this.getDefaultAuthClientUsedForCitizenLogin()
				)
			);
		}

		const clientNames = clientConfig.map((item) => item.clientName);
		const clientIds = clientConfig.map((item) => item.clientId);
		// Store information needed when coming back from sso in our state variable
		// add a random id to make it unique, be wary of 414 Request URI too long
		const stateData = {
			id: Math.random(),
			userId: store.state.user.userId,
			authClientName: clientNames.join(','),
			routeAfterLogin,
			scope,
		} as IStateData;

		const state = btoa(JSON.stringify(stateData));

		// Save state locally, to be verified when coming back from sso
		window.localStorage.setItem('OauthState', state);

		// Build login url
		const loginUrl =
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			buildUrl(clientConfig[0].authorityUrl, '/connect/authorize') +
			'?client_id=' +
			clientIds +
			'&scope=' +
			scope +
			'+offline_access' +
			'&response_type=code&redirect_uri=' +
			clientConfig[0].redirectUrl +
			'&state=' +
			state;

		// Redirect to login methods
		if (scope === this.config.adminScope) {
			window.location.replace(loginUrl);
		}
		return (
			loginUrl +
			'&client_name=' +
			clientNames +
			'&frejaCancelUrl=' +
			window.location.href
		);
	}
}

const buildUrl = (host: string, pathWithLeadingSlash: string): string => {
	return (
		(host.slice(-1) === '/' ? host.substring(0, host.length - 1) : host) +
		pathWithLeadingSlash
	);
};

const loader = (config: AuthConfig): Oauth => {
	return new Oauth(config);
};

interface IStateData {
	routeAfterLogin: string;
	scope: string;
	id: any;
	userId: string;
	authClientName: string;
}

export default loader;
