<template>
	<div class="admin-list">
		<admin-header :form-is-open="false" />

		<div class="content-wrap">
			<admin-list-sidebar />

			<div class="space-left"></div>

			<div class="content">
				<!-- Render e-services, settings or integrations -->
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AdminHeader from '@/components/admin/AdminHeader.vue';
import AdminListSidebar from '@/components/admin/AdminList/AdminListSidebar.vue';
import { useTitle } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useTitle(t('component.adminListForms.title') + ' - ' + t('app.title'));
</script>

<style scoped lang="scss">
.admin-list {
	background-color: #fff;
	min-height: 100vh;
	.content-wrap {
		display: flex;
		flex-direction: row;
		.space-left {
			max-width: 324px;
			min-width: 200px;
			width: 20%;
		}

		.content {
			flex: 1;
		}
	}

	:deep(.v-data-table) {
		.admin-list-item {
			color: $grey-darken-1;
			cursor: pointer;
			.title {
				color: #000;

				&.empty-title {
					color: $grey-lighten-5;
					font-style: italic;
				}
			}

			&:hover {
				background-color: $grey-lighten-2;
			}
			td {
				background-color: transparent;
				.v-btn {
					background-color: transparent;
				}
			}
		}
	}

	:deep(.admin-list-search-wrap) {
		display: flex;
		flex-direction: row;

		.ume-text-field {
			flex: 1;
			border-radius: $border-radius;
			overflow: hidden;

			.border-bottom {
				display: none;
			}
		}
		.v-btn {
			border-radius: $border-radius;
			text-transform: none;
			letter-spacing: normal;
			margin: 0;
			margin-left: 20px;
			padding: 0 24px;

			--v-btn-height: 45px;

			&--variant-outlined {
				border-color: $grey-lighten-5;
			}
		}
	}
	:deep(.admin-list-no-results) {
		border-radius: $border-radius;
		margin-top: 20px;
	}
}
</style>

<style lang="scss">
.admin-list-context-menu {
	border-radius: $border-radius !important;

	.color-red {
		color: $error;
	}
	.v-list-item__prepend > .v-icon {
		margin-right: 14px;
	}
}
.admin-list-edit {
	.v-card {
		max-height: calc(100vh - 48px);
		display: flex;
		flex-direction: column;
	}
	:deep(.v-col) {
		padding-bottom: 0;
		padding-top: 0;
	}
	.v-card-title {
		font-size: size(18);
		font-weight: bold;
	}
	.v-card-text {
		overflow-y: auto;

		.v-row {
			flex-wrap: nowrap;
			align-items: center;
			margin: 0;

			.v-col {
				flex: 1;
				align-items: center;
				padding: 0;

				.v-field--disabled {
					opacity: 0.8;
				}
			}
		}
	}
	.v-card-actions {
		align-items: center;
		justify-content: flex-end;
		display: flex;
	}
}
</style>
