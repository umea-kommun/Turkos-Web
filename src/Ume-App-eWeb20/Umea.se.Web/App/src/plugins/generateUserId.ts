import Axios from 'axios';
import { Helper } from '@/utils/helper';
import store from '@/store/store';
import { MutationType } from '@/models/Enums';

export default {
	install: (app: any) => {
		/**
		 * If no userId is stored in session, then we create it
		 */
		if (!store.state.user.userId) {
			const generatedUserId = Helper.generateUuid();
			store.commit(MutationType.UserEnterPage, {
				userId: generatedUserId,
			});
		}

		/** Store userId in session */
		if (store.state.user.userId) {
			const authenticatedUserId = 'X-AuthenticatedUserId';
			Axios.defaults.headers.common[authenticatedUserId] =
				store.state.user.userId;
		}
	},
};
