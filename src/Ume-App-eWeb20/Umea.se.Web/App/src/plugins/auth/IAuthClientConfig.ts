/* eslint-disable semi */
export default interface IAuthClientConfig {
	clientId: string;
	clientName: string;
	clientDisplayName: string;
	clientSecret: string;
	clientLogo: string;
	authorityUrl: string;
	logoutUrl: string;
	redirectUrl: string;
	scope: string;
}
