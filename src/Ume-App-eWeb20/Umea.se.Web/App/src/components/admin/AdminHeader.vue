<template>
	<header class="admin-header" :class="{ 'form-is-open': formIsOpen }">
		<img :src="ukGreenLogo" class="logo" />
		<v-breadcrumbs>
			<v-breadcrumbs-divider>/</v-breadcrumbs-divider>
			<v-breadcrumbs-item
				class="breadcrumb-eServices"
				href="/admin"
				:title="t('app.admin.header.eServices')"
				:active="!formIsOpen"
			/>
			<v-breadcrumbs-divider v-if="formIsOpen">/</v-breadcrumbs-divider>
			<v-breadcrumbs-item
				v-if="formIsOpen"
				active
				class="breadcrumb-eService-title"
				@click="editTitle"
			>
				<span>{{ form.attributes.title }}</span>
				<v-icon icon="edit" />
			</v-breadcrumbs-item>
		</v-breadcrumbs>

		<v-tabs v-if="formIsOpen" v-model="activeTab" slider-color="primary">
			<v-tab
				tabindex="0"
				v-if="
					form.attributes.type !== FormType.InfoPage &&
					form.attributes.type !== FormType.LinkExternal
				"
				value="AdminForm.Edit"
			>
				{{ t('app.admin.header.tabs.edit') }}
			</v-tab>
			<v-tab tabindex="0" value="AdminForm.Settings">
				{{ t('app.admin.header.tabs.settings') }}
			</v-tab>
		</v-tabs>
		<v-tabs v-else></v-tabs>

		<div v-if="formIsOpen" class="last-saved" :title="lastSaveMessage">
			{{ lastSaveMessage }}
		</div>

		<v-menu v-if="formIsOpen" location="bottom end">
			<template v-slot:activator="{ props }">
				<div class="preview-button">
					<v-btn
						class="action"
						@click="openPublicPreviewForm"
						variant="outlined"
						:title="t('app.admin.header.preview')"
					>
						<v-icon icon="visibility" />
						<span class="btn-text">{{
							t('app.admin.header.preview')
						}}</span>
					</v-btn>
					<v-btn variant="outlined" v-bind="props" class="dropdown">
						<v-icon
							id="preview-menu-activator"
							icon="arrow_drop_down"
						/>
					</v-btn>
				</div>
			</template>
			<v-list class="preview-menu">
				<v-list-item link @click="openPublicForm">
					<v-list-item-title>
						<v-icon icon="open_in_new" size="20" />
						{{ t('app.admin.header.open') }}
					</v-list-item-title>
				</v-list-item>

				<v-list-item link @click="copyPublicLink">
					<v-list-item-title>
						<v-icon icon="content_copy" size="20" />
						{{ t('app.admin.header.copyPublicLink') }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</v-menu>
		<v-btn
			v-if="formIsOpen"
			flat
			color="primary"
			:disabled="!canSaveForm"
			:loading="sendingFormToServer"
			@click="emit('saveForm')"
		>
			{{ t('app.admin.header.save') }}
		</v-btn>

		<v-btn icon flat class="avatar-button" id="user-menu-activator">
			<v-avatar class="user-avatar" :size="36">
				<span class="text-h5">{{ userInitials }}</span>
			</v-avatar>
		</v-btn>
		<v-menu location="bottom end" activator="#user-menu-activator">
			<v-card class="user-menu">
				<v-layout>
					<v-col>
						<v-avatar size="50" class="user-avatar">
							<span class="text-h5">{{ userInitials }}</span>
						</v-avatar>
					</v-col>
					<v-col>
						<h3>{{ user.fullName }}</h3>
						<div>{{ user.email }}</div>
					</v-col>
				</v-layout>
				<v-divider></v-divider>
				<v-list flat>
					<v-list-item link @click="logout">
						<v-list-item-title>
							{{ t('component.appHeader.menu.logout') }}
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-card>
		</v-menu>
	</header>
</template>

<script setup lang="ts">
import { IForm, IRootState } from '@/models/IForm';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import moment from 'moment';
import { FormStatus, MutationType, FormType } from '@/models/Enums';
import { inject, computed } from 'vue';
import { useTConfirmDialog } from '@turkos/components';
import IAuthManager from '@/plugins/auth/IAuthManager';
import ukGreenLogo from '@/assets/logo_green.png';

defineProps({
	canSaveForm: {
		default: true,
		type: Boolean,
	},
	sendingFormToServer: {
		default: false,
		type: Boolean,
	},
	formIsOpen: {
		type: Boolean,
		default: true,
	},
});
const emit = defineEmits(['saveForm']);

const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();
const { t } = useI18n();
const { tConfirmDialogAsync } = useTConfirmDialog();

const route = useRoute();
const router = useRouter();

const user = computed(() => store.state.user);
const form = computed(() => store.state.form as IForm);

const activeTab = computed({
	get: () => {
		const routeName = route.name?.toString();
		if (routeName && routeName.indexOf('AdminForm.Settings') > -1) {
			return 'AdminForm.Settings';
		}
		return routeName ?? '';
	},
	set: (newActiveTab: string) => {
		router.push({
			name: newActiveTab,
			params: { formId: route.params.formId },
		});
	},
});

const userInitials = computed(() => {
	const initials = user.value.fullName
		?.match(/(\b\S)?/g)
		?.join('')
		?.match(/(^\S|\S$)?/g)
		?.join('')
		.toUpperCase();

	if (initials) {
		return initials;
	}
	return '';
});

const formHasUnsavedChanges = computed(() => {
	return store.state.formHasUnsavedChanges;
});
const haveSavedAnyChanges = computed(() => {
	return store.state.admin?.haveSavedAnyChanges ?? false;
});

const lastSaveMessage = computed(() => {
	if (formHasUnsavedChanges.value) {
		return t('component.appForm.notSaved');
	} else {
		const lastSaveDate = store.getters.formLastSavedDate;
		if (!lastSaveDate) {
			return '';
		}
		const lastSaved = moment(lastSaveDate);
		const savedToday = lastSaved.isSame(new Date(), 'day');
		if (haveSavedAnyChanges.value) {
			return t('component.appForm.allChangesSaved');
		} else if (savedToday) {
			return t('component.appForm.savedToday');
		} else {
			return t('component.appForm.saved') + lastSaved.fromNow();
		}
	}
});

function getAbsoluteUrlToForm(): string {
	return (
		window.location.protocol +
		'//' +
		window.location.host +
		'/' +
		form.value.attributes.path
	);
}

function copyPublicLink(): void {
	navigator.clipboard.writeText(getAbsoluteUrlToForm());
}

async function openPublicForm(): Promise<void> {
	// Let used know that we're opening a e-service that has unsaved changes
	if (store.state.formHasUnsavedChanges) {
		const open = await tConfirmDialogAsync(
			t('component.adminFormTitle.confirmOpenEserviceTitle'),
			t('component.adminFormTitle.confirmOpenEserviceText'),
			{
				text: t('app.nav.open'),
			}
		);
		if (!open) {
			return;
		}
	}

	if (form.value.attributes.status === FormStatus.Published) {
		window.open('/' + form.value.attributes.path);
	} else {
		const previewRoute = router.resolve({
			name: 'AppFormTest',
			params: { testFormId: form.value.id },
		});
		window.open(previewRoute.href);
	}
}

async function openPublicPreviewForm(): Promise<void> {
	// Let used know that we're opening a e-service that has unsaved changes
	if (store.state.formHasUnsavedChanges) {
		const open = await tConfirmDialogAsync(
			t('component.adminFormTitle.confirmOpenEserviceTitle'),
			t('component.adminFormTitle.confirmOpenEserviceText'),
			{
				text: t('app.nav.open'),
			}
		);
		if (!open) {
			return;
		}
	}
	const previewRoute = router.resolve({
		name: 'AppFormPreviewTest',
		params: { previewTestFormId: form.value.id },
	});
	window.open(previewRoute.href);
}

function logout(): void {
	store.commit(MutationType.TruncateForm); // Remove possibly stored data in session storage
	auth.logoutRedirectingToStartPage(
		user.value.authClientName,
		'logoutReason=manual'
	);
}

async function editTitle(): Promise<void> {
	if (route.name?.toString() !== 'AdminForm.Settings') {
		await router.push({
			name: 'AdminForm.Settings',
			params: { formId: route.params.formId },
		});
	}

	const titleField = document.getElementById('eService-title');
	if (titleField) {
		titleField.focus();
	}
}
</script>

<style scoped lang="scss">
.admin-header {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;

	background-color: $white;
	padding: 0 32px;

	display: flex;
	align-items: center;
	flex-wrap: nowrap;

	box-shadow: 0px 2px 6px #00000029;

	.logo {
		height: 38px;
		margin-top: 10px;
		margin-bottom: 14px;
	}
	.v-breadcrumbs {
		&-divider {
			color: $grey-lighten-5;
		}
		&-item {
			&--link {
				color: $grey-darken-1 !important;
			}

			&--active {
				color: $black !important;
			}

			&.breadcrumb-eService-title {
				span {
					display: inline-block;
					cursor: pointer;
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					max-width: 300px;
				}
			}
			.v-icon {
				opacity: 0;
				margin-left: 6px;
				color: $grey-darken-2;
			}
			&:hover {
				.v-icon {
					opacity: 1;
				}
			}
		}
	}

	.v-tabs {
		flex: 2;
		--v-tabs-height: 62px;

		:deep(.v-slide-group__content) {
			justify-content: center;
		}
		.v-tab {
			margin: 0;
			height: 100%;
			color: $grey-darken-1;
			text-transform: none;
			font-weight: bold;
			letter-spacing: normal;
			font-size: size(16);

			&--selected {
				color: $primary;
			}
		}
	}

	.last-saved {
		text-align: right;
		flex: 1;
		max-width: 250px;
		font-style: italic;
		color: $grey-darken-1;
		margin-right: 10px;

		display: inline-block;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}

	.v-btn {
		color: $grey-darken-2;
		text-transform: none;
		letter-spacing: normal;
		font-size: size(16);
	}
	.preview-button {
		.v-btn {
			border-color: $grey-lighten-4;
		}
		.action {
			.v-icon {
				margin-right: 6px;
			}
			border-right: none;
			border-radius: 8px 0 0 8px;
			margin-right: 0;
		}

		.dropdown {
			border-radius: 0 8px 8px 0;
			font-size: 22px;
			min-width: 30px;
			padding-left: 4px;
			padding-right: 4px;
			margin-left: 0;
		}
	}

	.avatar-button {
		margin-left: 10px;
		border-radius: 100px;
	}

	&.form-is-open {
		@media only screen and (max-width: 1250px) {
			.breadcrumb-eServices {
				display: inline-block;
				max-width: 24px;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.breadcrumb-eService-title span {
				max-width: 150px !important;
			}
			.preview-button .btn-text {
				max-width: 50px;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
		@media only screen and (max-width: 1000px) {
			.v-breadcrumbs {
				padding-left: 0;
			}
			.logo,
			.last-saved {
				display: none;
			}
		}
		@media only screen and (max-width: 860px) {
			.v-breadcrumbs-divider,
			.breadcrumb-eServices,
			.preview-button {
				display: none;
			}
		}
	}
}

.preview-menu {
	margin-top: 6px;
	border-radius: $border-radius !important;
	box-shadow: 0px 2px 6px #00000029 !important;

	.v-icon {
		margin-right: 6px;
	}
}

.user-avatar {
	background-color: $primary-bg;

	.text-h5 {
		font-size: 1em !important;
		font-weight: bold;
	}
}

.user-menu {
	margin-top: 14px;
	border-radius: $border-radius !important;
	box-shadow: 0px 2px 6px #00000029 !important;
	.v-layout {
		align-items: center;
		padding: 10px;
		padding-right: 30px;
	}
	.v-list-item {
		padding-inline-start: 26px;
	}
}
</style>
