import Config from '@/utils/Config';
import { FieldsCopyMemory, ImtCaptcha, IUser } from '@/models/IForm';
import { createStore, StoreOptions } from 'vuex';
import { IRootState } from '@/models/IForm';
import actions from './actions';
import mutations from './mutations';
import { getters } from './getters';
import { getAnonymousContactInfo } from './helper';
import VuexPersist from 'vuex-persist';
import { dataSourceVuexPlugin } from '@/plugins/dataService';
import { MethodChoice } from '@/models/Enums';

const state = {
	ecos: null,
	pm3: null,
	form: null,
	user: {
		...getAnonymousContactInfo(),
		isAuthenticated: false,
		userId: '',
		authClientName: '',
	} as IUser,
	result: null,
	forms: null,
	initialForms: null,
	initialGroups: null,
	formHasUnsavedChanges: false,
	validationRuleTypes: null,
	receivers: null,
	templates: null,
	gdpr: null,
	lifeSituations: null,
	categories: null,
	selectedDisplayRule: null,
	multipleSigningByLink: null,
	eServiceErrorMessage: null,
	fieldsCopyMemory: {
		copiedFields: [],
		history: [],
		methodChoice: MethodChoice.Copy,
	} as FieldsCopyMemory,
	fieldsLoadingDataSource: [],
	lastFormTitle: null,
	mtCaptcha: { isTriggered: false, isVerified: false } as ImtCaptcha,
	activeTextAreaInput: null,
	activeTinyMceEditorId: null,
	insertAtCursor: null,
};

const vuexPersistToSessionStorage = new VuexPersist({
	key: 'BasicUseVueApp',
	reducer: (state: IRootState) => ({ user: state.user }),
	storage: window.sessionStorage,
});

const vuexPersistToLocalStorage = new VuexPersist({
	key: 'BasicUseVueAppV2',
	reducer: (state: IRootState) => ({
		fieldsCopyMemory: state.fieldsCopyMemory,
	}),
	storage: window.localStorage,
});

/** Initialize Vuex store.
 * Strict-mode means that state could only be updated through mutations, otherwise throw an error.
 * Don't use strict mode in production due to performance cost.
 */
const store: StoreOptions<IRootState> = {
	strict: Config.NODE_ENV !== 'production',
	state,
	getters,
	mutations,
	actions,
	plugins: [
		dataSourceVuexPlugin,
		vuexPersistToSessionStorage.plugin as any,
		vuexPersistToLocalStorage.plugin as any,
	],
};

export default createStore<IRootState>(store);
