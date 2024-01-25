import Config from '@/utils/Config';
import { IRootState } from '@/models/IForm';
import { GetterTree } from 'vuex';

export const getters: GetterTree<IRootState, IRootState> = {
	isLoggedInAdmin(state: IRootState): boolean {
		const scopes = state.user.scope || [];
		return (
			state.user.isAuthenticated &&
			scopes.indexOf(Config.VUE_APP_AUTH_SCOPE_ADMIN) > -1
		);
	},
	userHasProtectedIdentity(state: IRootState): boolean {
		return (state.user.protectedIdentity || '').toLowerCase() === 'yes';
	},
	formLastSavedDate(state: IRootState): Date | null {
		if (state.form) {
			const dateString =
				state.form.attributes.modified || state.form.attributes.created;
			return new Date(dateString);
		}
		return null; // throw new Error('Trying to get save date of form but no form present in the store');
	},
};
