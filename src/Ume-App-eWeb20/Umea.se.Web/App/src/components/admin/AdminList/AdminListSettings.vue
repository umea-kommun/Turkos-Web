<template>
	<div class="admin-list-settings">
		<h1 class="mt-2 mb-2">{{ $t('component.adminListSettings.title') }}</h1>
		<v-tabs v-model="activeTab">
			<v-tab value="receiver">{{
				$t('component.adminListForms.receiver')
			}}</v-tab>
			<v-tab value="pm3">{{ $t('component.adminListForms.pm3') }}</v-tab>
			<v-tab value="gdpr">{{
				$t('component.adminListForms.gdpr')
			}}</v-tab>
			<v-tab value="lifeSituation">{{
				$t('component.adminForm.menu.lifeSituation')
			}}</v-tab>
			<v-tab value="category">{{
				$t('component.adminForm.menu.category')
			}}</v-tab>
		</v-tabs>
		<v-divider />
		<v-window :model-value="activeTab" :disabled="true">
			<v-window-item value="receiver">
				<admin-receiver-list />
			</v-window-item>
			<v-window-item value="pm3">
				<admin-pm3-list />
			</v-window-item>
			<v-window-item value="gdpr">
				<admin-gdpr-list />
			</v-window-item>
			<v-window-item value="lifeSituation">
				<admin-life-situation-list />
			</v-window-item>
			<v-window-item value="category">
				<admin-category-list />
			</v-window-item>
		</v-window>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminReceiverList from './Settings/AdminReceiverList.vue';
import AdminPm3List from './Settings/AdminPm3List.vue';
import AdminGdprList from './Settings/AdminGdprList.vue';
import AdminLifeSituationList from './Settings/AdminLifeSituationList.vue';
import AdminCategoryList from './Settings/AdminCategoryList.vue';

const activeTab = ref('receiver');
</script>

<style scoped lang="scss">
.admin-list-settings {
	padding: 20px 30px;

	.create-service-menu-list {
		min-width: max-content;
		border-radius: $border-radius !important;
	}

	.v-tabs {
		flex: 1;
		--v-tabs-height: 48px;

		:deep(.v-slide-group__content) {
			justify-content: flex-start;
		}
		.v-tab {
			padding: 0 10px;
			margin: 0;
			margin-right: 10px;
			height: 100%;
			color: $grey-darken-1;
			text-transform: none;
			font-weight: bold;
			letter-spacing: normal;

			&--selected {
				color: $primary;
			}
		}
	}
	.v-window-item {
		transition: none;
	}
}
</style>
