<template>
	<v-card class="admin-settings-sidebar">
		<admin-form-error />
		<div class="admin-settings-sidebar__content">
			<h3 class="subtitle">
				{{
					$t(
						'component.adminForm.adminSettingsSidebar.settingsSubtitle'
					)
				}}
			</h3>
			<v-list color="primary">
				<v-list-item
					rounded
					@click="activePage = 'AdminForm.Settings'"
					:active="activePage === 'AdminForm.Settings'"
					prepend-icon="settings"
				>
					<v-list-item-title>
						{{
							$t(
								'component.adminForm.adminSettingsSidebar.settingsSubtitle'
							)
						}}
					</v-list-item-title>
				</v-list-item>
			</v-list>

			<h3 class="subtitle">
				{{
					$t(
						'component.adminForm.adminSettingsSidebar.afterSendInSubtitle'
					)
				}}
			</h3>
			<v-list color="primary">
				<v-list-item
					rounded
					@click="activePage = 'AdminForm.Settings.Email'"
					:active="activePage === 'AdminForm.Settings.Email'"
					prepend-icon="mail_outline"
				>
					<v-list-item-title>
						{{
							$t('component.adminForm.adminSettingsSidebar.email')
						}}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					rounded
					@click="activePage = 'AdminForm.Settings.Integration'"
					:active="activePage === 'AdminForm.Settings.Integration'"
					prepend-icon="cloud_queue"
				>
					<v-list-item-title>
						{{
							$t(
								'component.adminForm.adminSettingsSidebar.integration'
							)
						}}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					rounded
					@click="activePage = 'AdminForm.Settings.CES'"
					:active="activePage === 'AdminForm.Settings.CES'"
					prepend-icon="insert_chart_outlined"
				>
					<v-list-item-title>
						{{ $t('component.adminForm.adminSettingsSidebar.CES') }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminFormError from '../Validation/AdminFormError.vue';

const route = useRoute();
const router = useRouter();

const activePage = computed({
	get: () => {
		const routeName = route.name?.toString();
		return routeName ?? '';
	},
	set: (newActivePage: string) => {
		router.push({
			name: newActivePage,
			params: { formId: route.params.formId },
		});
	},
});
</script>

<style scoped lang="scss">
.admin-settings-sidebar {
	position: fixed;
	top: 62px;
	left: 0;
	bottom: 0;
	max-width: 324px;
	width: 20%;
	border-radius: 0;
	overflow-y: auto;

	&__content {
		padding: 20px;
	}

	.subtitle {
		font-size: size(16);
		color: $grey-darken-1;
	}

	.v-list-item {
		border-radius: 8px;
		padding: 0;
		min-height: 40px;
		margin-bottom: 8px;

		:deep(.v-list-item__spacer) {
			display: none;
		}
		:deep(.v-list-item__prepend .v-icon) {
			color: $grey-darken-3;
			margin-right: 8px;
			font-size: size(20);
		}

		&--active {
			:deep(.v-list-item__prepend .v-icon) {
				color: $primary;
			}
		}
	}
}
</style>
