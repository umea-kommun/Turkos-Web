/* eslint-disable semi */
import IAuthClientConfig from './IAuthClientConfig';

export default interface IAuthManager {
	/**
	 * Returns the names of the supported auth clients (that is configured)
	 */
	getAuthClientsUsedForCitizenLogin(): Array<{
		displayName: string;
		name: string;
	}>;

	/**
	 * URL to client logo
	 * @param authClientName
	 */
	getAuthClientLogo(authClientName: string): string;

	/**
	 * Returns the default auth client
	 */
	getDefaultAuthClientUsedForCitizenLogin(): string;

	/**
	 * Login user as some one using e-services (web forms)
	 */
	loginCitizen(routeAfterLogin: string, authClientName: string[]): string;

	/**
	 * Login user as administrator, someone creating e-services (web forms)
	 * @param routeAfterLogin
	 */
	loginAdmin(routeAfterLogin: string): void;

	/**
	 * Method that should logout the user, both in this app and over at the central authorization server.
	 * After the user is logged out the user should be redirected back to the start page of the app.
	 *
	 * @param extraQueryParams Query parameters that should be sent along in the
	 * URL when the user is redirected back to the startpage
	 */
	logoutRedirectingToStartPage(
		authClientName: string,
		extraQueryParams: string
	): void;

	/**
	 * Logout user and come afterwards back to given "routeAfterLogin"
	 * @param authClientName
	 * @param routeAfterLogin
	 */
	logout(routeAfterLogin: string, authClientName?: string): void;

	/**
	 * Params "state" and "code" comes from authorization server as query parameters
	 * after the user have been redirected back to the app after login.
	 *
	 * This method should return the path of the route that the user should be redirect
	 * after login is handled.
	 *
	 * @param state
	 * @param code
	 */
	handleLoginCallbackAsync(state: string, code: string): Promise<string>;

	getAllClientsConfig(): IAuthClientConfig[];
}
