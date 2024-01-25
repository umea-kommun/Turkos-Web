import IAuthClientConfig from './IAuthClientConfig';

export default class AuthConfig {
	public loginStatusCommunicatorPath: string | null;
	public publicScope: string;
	public adminScope: string;
	public authClass: string;
	private authClients: IAuthClientConfig[] = [];

	public constructor(config: any) {
		this.publicScope = config.VUE_APP_AUTH_SCOPE_PUBLIC;
		this.adminScope = config.VUE_APP_AUTH_SCOPE_ADMIN;
		this.loginStatusCommunicatorPath =
			config.VUE_APP_AUTH_SSO_LOGIN_STATUS_PATH;
		this.authClass = config.VUE_APP_AUTH_CLASS;

		// Parse out the auth clients that we have in config

		const variableSuffixes = [
			'CLIENT_ID',
			'CLIENT_NAME',
			'CLIENT_DISPLAY_NAME',
			'CLIENT_SECRET',
			'AUTHORITY_URL',
			'REDIRECT_URL',
			'LOGOUT_URL',
			'CLIENT_LOGO',
		];

		const authClientMap = new Map<string, IAuthClientConfig>();
		Object.keys(config).forEach((key) => {
			if (key.indexOf('VUE_APP_AUTH_') === 0) {
				// Remove prefix
				const configName = key.replace('VUE_APP_AUTH_', '');
				// Find which type of variable this is (check which suffix the variable name ends with)
				const variableName = variableSuffixes.find(
					(suffix) =>
						configName.substring(configName.indexOf(suffix)) ===
						suffix
				);
				if (variableName) {
					// Add config data to the client config
					const authClientKey = configName.replace(
						'_' + variableName,
						''
					);
					if (!authClientMap.has(authClientKey)) {
						authClientMap.set(authClientKey, {
							scope:
								key.indexOf('VUE_APP_AUTH_ADMIN') === 0
									? this.adminScope
									: this.publicScope,
						} as any);
					}
					const configPropName =
						// eslint-disable-next-line @typescript-eslint/no-use-before-define
						upperKebabCaseToCamelCase(variableName);
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					// @ts-expect-error TEST, FIX ME
					authClientMap.get(authClientKey)![configPropName] =
						config[key];
				}
			}
		});
		this.authClients = [...authClientMap.values()];
	}

	public getAdminClientConfig(): IAuthClientConfig {
		return this.authClients.filter(
			(clientConfig) => clientConfig.scope === this.adminScope
		)[0];
	}

	public getPublicAuthClientConfigs(): IAuthClientConfig[] {
		return this.authClients.filter(
			(clientConfig) => clientConfig.scope === this.publicScope
		);
	}

	public getClientConfig(clientId: string): IAuthClientConfig {
		const configs = this.authClients.filter(
			(clientConfig) => clientConfig.clientId === clientId
		);
		if (configs.length === 0) {
			throw new Error(
				'No auth client configuration found for client with client id ' +
					clientId
			);
		}
		return configs[0];
	}

	public getClientConfigByName(clientName: string): IAuthClientConfig {
		if (clientName === 'AllLoginMethods') {
			const configAllLoginMethods = {
				clientId: 'AllLoginMethods',
				clientName: 'AllLoginMethods',
				clientDisplayName: '',
				clientSecret: '',
				authorityUrl: '',
				logoutUrl: '',
				redirectUrl: '',
				scope: '',
			} as IAuthClientConfig;
			return configAllLoginMethods;
		}
		const configs = this.authClients.filter(
			(clientConfig) => clientConfig.clientName === clientName
		);
		if (configs.length === 0) {
			throw new Error(
				'No auth client configuration found for client with name ' +
					clientName
			);
		}
		return configs[0];
	}

	public getClientConfigByScope(scope: string): IAuthClientConfig {
		const configs = this.authClients.filter(
			(clientConfig) => clientConfig.scope === scope
		);
		if (configs.length === 0) {
			throw new Error(
				'No auth client configuration found for client with name ' +
					scope
			);
		}
		return configs[0];
	}

	public getAllClientsConfig(): IAuthClientConfig[] {
		return this.authClients;
	}
}

const upperKebabCaseToCamelCase = (str: string): string => {
	const chunks: string[] = [];
	str.toLowerCase()
		.split('_')
		.forEach((chunk) => {
			chunks.push(
				chunk.substring(0, 1).toUpperCase() + chunk.substring(1)
			);
		});
	const newString = chunks.join('');
	return newString.substring(0, 1).toLowerCase() + newString.substring(1); // leading lower case
};
