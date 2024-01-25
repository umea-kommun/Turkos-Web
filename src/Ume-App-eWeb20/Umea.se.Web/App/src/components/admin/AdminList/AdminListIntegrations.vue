<template>
	<div class="admin-list-integrations">
		<h1 class="mt-2 mb-2">
			{{ $t('component.adminListIntegrations.title') }}
		</h1>
		<v-tabs v-model="activeTab">
			<v-tab value="ecos">{{
				$t('component.adminListIntegrations.tabs.ecos')
			}}</v-tab>
		</v-tabs>
		<v-divider />
		<v-window :model-value="activeTab" :disabled="true">
			<v-window-item value="ecos">
				<admin-ecos-template-list />
			</v-window-item>
		</v-window>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminEcosTemplateList from './Integrations/AdminEcosTemplateList.vue';

const activeTab = ref('receiver');
</script>

<style scoped lang="scss">
.admin-list-integrations {
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
