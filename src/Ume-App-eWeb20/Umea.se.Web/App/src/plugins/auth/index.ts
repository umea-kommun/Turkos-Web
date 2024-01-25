import store from '@/store/store';
import IAuthManager from './IAuthManager';
import AuthConfig from './AuthConfig';
import authLoader from './Oauth';
import fakeAuthLoader from './FakeDemoAuth';

let auth: IAuthManager; // FIX THIS or is this okay?

export default function Auth(options?: any): IAuthManager {
	const config = new AuthConfig(options.config);
	const _auth =
		config.authClass === 'FakeDemoAuth'
			? (fakeAuthLoader(config) as IAuthManager)
			: (authLoader(config) as IAuthManager);

	// Check if jwt expired every fifth second, and in that case logout
	const handleExpiredJwt = (): void => {
		if (store.state.user.isAuthenticated && store.state.user.exp) {
			const expireDate = new Date(store.state.user.exp * 1000);
			if (expireDate.getTime() < new Date().getTime()) {
				_auth.logoutRedirectingToStartPage(
					store.state.user.authClientName,
					'logoutReason=sessionExpired'
				);
			}
		}
	};
	handleExpiredJwt();
	setInterval(handleExpiredJwt, 5000);

	auth = _auth;
	return _auth;
}

export function authMiddleware(router: any): void {
	router.beforeEach((to: any, from: any, next: any) => {
		let loadNextMiddleware = true;
		if (to.meta && to.meta.requiresAdminLogin) {
			if (
				store.state.user.isAuthenticated &&
				!store.getters.isLoggedInAdmin
			) {
				auth.logout(to.path, store.state.user.authClientName);
			} else if (!store.state.user.isAuthenticated) {
				try {
					auth.loginAdmin(to.path);
				} catch (err) {
					// strange... vue seems to mute thrown errors in beforeEach??
					console.error(err);
					throw err;
				}
				loadNextMiddleware = false;
			}
		}
		if (loadNextMiddleware) {
			next();
		}
	});
}

export const b64DecodeUnicode = (str: string): string => {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(
		atob(str)
			.split('')
			.map((c) => {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			})
			.join('')
	);
};
