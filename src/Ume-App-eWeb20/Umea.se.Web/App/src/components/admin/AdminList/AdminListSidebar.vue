<template>
	<v-card class="admin-list-sidebar admin-sidebar">
		<div class="admin-list-sidebar__content">
			<h3 class="subtitle">
				{{ $t('component.adminListSidebar.title') }}
			</h3>
			<v-list color="primary">
				<v-list-item
					rounded
					@click="activePage = 'AdminList.Forms'"
					:active="activePage === 'AdminList.Forms'"
					prepend-icon="list"
				>
					<v-list-item-title>
						{{ $t('app.service') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					rounded
					@click="activePage = 'AdminList.Settings'"
					:active="activePage === 'AdminList.Settings'"
					prepend-icon="settings"
				>
					<v-list-item-title>
						{{ $t('component.adminListSettings.title') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					rounded
					@click="activePage = 'AdminList.Integrations'"
					:active="activePage === 'AdminList.Integrations'"
					prepend-icon="cloud_queue"
				>
					<v-list-item-title>
						{{ $t('component.adminListIntegrations.title') }}
					</v-list-item-title>
				</v-list-item>
				<v-list-item
					rounded
					@click="activePage = 'AdminList.Banner'"
					:active="activePage === 'AdminList.Banner'"
					prepend-icon="warning"
				>
					<v-list-item-title>
						{{ $t('component.adminBanner.title') }}
					</v-list-item-title>
				</v-list-item>
			</v-list>
		</div>
	</v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
.admin-list-sidebar {
	background-color: #f3f3f3;
	position: fixed;
	top: 62px;
	left: 0;
	bottom: 0;
	max-width: 324px;
	min-width: 200px;
	width: 20%;
	border-radius: 0;
	overflow-y: auto;

	.v-list {
		background-color: #f3f3f3;
	}

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

		:deep(.v-list-item__spacer){
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
