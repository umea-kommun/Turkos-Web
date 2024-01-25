import {
	createRouter,
	createWebHistory,
	RouteParams,
	RouteRecordRaw,
} from 'vue-router';
import { authMiddleware } from '@/plugins/auth';
import AppStart from '@/components/app/AppStart.vue';
import AuthCallback from '@/components/auth/AuthCallback.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import AdminFormEdit from '@/components/admin/AdminFormEdit.vue';
import AdminFormSettings from '@/components/admin/AdminFormSettings.vue';
import AdminGeneralSettings from '@/components/admin/Settings/General/AdminGeneralSettings.vue';
import AdminEmailSettings from '@/components/admin/Settings/Integration/AdminEmailSettings.vue';
import AdminIntegrationSettings from '@/components/admin/Settings/Integration/AdminIntegrationSettings.vue';
import AdminCESSettings from '@/components/admin/Settings/CES/AdminCESSettings.vue';
import AppPrintForm from '@/components/app/AppPrintForm.vue';
import AppForm from '@/components/app/AppForm.vue';
import AppFormConfirmation from '@/components/app/AppFormConfirmation.vue';
import AdminList from '@/components/admin/AdminList/AdminList.vue';
import AdminListForms from '@/components/admin/AdminList/AdminListForms.vue';
import AdminListSettings from '@/components/admin/AdminList/AdminListSettings.vue';
import AdminListIntegrations from '@/components/admin/AdminList/AdminListIntegrations.vue';
import AdminBanner from '@/components/admin/AdminList/Banner/AdminBanner.vue';

/**
 * Router
 * meta configures how the breadcrumb will show up.
 */

const routes: Array<RouteRecordRaw> = [
	{
		component: AppStart,
		name: 'AppStart',
		path: '/',
		meta: {
			contentSize: 'Wide',
			breadcrumb: () => [{ name: 'AppStart', to: '/' }],
		},
	},
	{
		component: AppStart,
		name: 'AppStartSortedByName',
		path: '/sort/:sortingType',
		props: true,
		meta: {
			contentSize: 'Wide',
			breadcrumb: () => [{ name: 'AppStart', to: '/' }],
		},
	},
	{
		component: AdminList,
		name: 'AdminList',
		path: '/admin',
		meta: {
			contentSize: 'Wide',
			requiresAdminLogin: true,
			breadcrumb: () => [{ name: 'AdminList', to: '/admin' }],
		},
		children: [
			{
				path: '',
				name: 'AdminList.Forms',
				component: AdminListForms,
			},
			{
				path: 'settings',
				name: 'AdminList.Settings',
				component: AdminListSettings,
			},
			{
				path: 'integrations',
				name: 'AdminList.Integrations',
				component: AdminListIntegrations,
			},
			{
				path: 'banner',
				name: 'AdminList.Banner',
				component: AdminBanner,
			},
		],
	},
	{
		component: AdminForm,
		name: 'AdminForm',
		path: '/admin/:formId',
		props: true,
		meta: {
			contentSize: 'Wide',
			requiresAdminLogin: true,
			breadcrumb: (routeParams: RouteParams) => [
				{ name: 'AdminListForms', to: '/admin' },
				{ name: 'AdminForm', to: `/admin/${routeParams.formId}` },
			],
		},
		children: [
			{
				path: '',
				name: 'AdminForm.Edit',
				component: AdminFormEdit,
			},
			{
				path: 'settings',
				component: AdminFormSettings,
				children: [
					{
						path: '',
						name: 'AdminForm.Settings',
						component: AdminGeneralSettings,
					},
					{
						path: 'email',
						name: 'AdminForm.Settings.Email',
						component: AdminEmailSettings,
					},
					{
						path: 'integration',
						name: 'AdminForm.Settings.Integration',
						component: AdminIntegrationSettings,
					},
					{
						path: 'ces',
						name: 'AdminForm.Settings.CES',
						component: AdminCESSettings,
					},
				],
			},
		],
	},
	{
		component: AuthCallback,
		name: 'AuthCallback',
		path: '/oauthCallback',
		props: true,
		meta: {
			breadcrumb: () => [],
		},
	},
	{
		component: AppForm,
		name: 'AppFormPreview',
		path: '/granska/:previewFormId/:stepId?',
		props: true,
		meta: {
			contentSize: 'Default',
			requiresAdminLogin: true,
			breadcrumb: (routeParams: RouteParams) => [
				{ name: 'AppStart', to: '/' },
				{
					name: 'AppForm',
					to: `/granska/${routeParams.previewFormId}`,
				},
			],
		},
	},
	{
		component: AppForm,
		name: 'AppFormTest',
		path: '/testa/:testFormId/:stepId?',
		props: true,
		meta: {
			contentSize: 'Default',
			breadcrumb: (routeParams: RouteParams) => [
				{ name: 'AppStart', to: '/' },
				{ name: 'AppForm', to: `/testa/${routeParams.testFormId}` },
			],
		},
	},
	{
		component: AppForm,
		name: 'AppFormPreviewTest',
		path: '/testaPreview/:previewTestFormId/:stepId?',
		props: true,
		meta: {
			contentSize: 'Default',
			breadcrumb: (routeParams: RouteParams) => [
				{ name: 'AppStart', to: '/' },
				{
					name: 'AppForm',
					to: `/testaPreview/${routeParams.previewTestFormId}`,
				},
			],
		},
	},
	{
		component: AppFormConfirmation,
		name: 'AppFormConfirmation',
		path: '/skickat/',
		props: true,
		meta: {
			contentSize: 'Default',
			breadcrumb: () => [
				{ name: 'AppStart', to: '/' },
				{ name: 'AppFormConfirmation', to: '/skickat/' },
			],
		},
	},
	{
		// Notice! This route must come before AppForm due to path configuration
		component: AppPrintForm,
		name: 'AppPrintForm',
		path: '/blankett/:formPath',
		props: true,
		meta: {},
	},
	{
		component: AppForm,
		name: 'AppForm',
		path: '/:formPath/:stepId?',
		props: true,
		meta: {
			contentSize: 'Default',
			breadcrumb: (routeParams: RouteParams) => [
				{ name: 'AppStart', to: '/' },
				{ name: 'AppForm', to: `/${routeParams.formPath}/1` },
			],
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

// Setup middleware that checks if currently logged in user
// has access to declared scopes
authMiddleware(router);

export default router;
