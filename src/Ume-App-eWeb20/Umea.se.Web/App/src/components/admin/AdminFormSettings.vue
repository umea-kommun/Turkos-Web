<template>
	<!-- EService -->
	<div
		v-if="
			form.attributes.type !== FormType.InfoPage &&
			form.attributes.type !== FormType.LinkExternal
		"
		class="admin-form-settings"
	>
		<!-- Left side bar -->
		<admin-settings-sidebar />

		<div class="space space-left"></div>
		<div class="admin-form-settings__content">
			<!-- Render general settings -->
			<router-view></router-view>
		</div>
		<div class="space"></div>
	</div>

	<!-- Link External -->
	<div
		v-else-if="form.attributes.type === FormType.LinkExternal"
		class="admin-form-settings"
	>
		<div class="admin-form-settings__content link-external">
			<v-card>
				<admin-form-error />
			</v-card>
			<!-- Render general settings -->
			<admin-general-settings :link-external="true" />
		</div>
	</div>

	<!-- Info Page -->
	<div v-else class="admin-form-settings">
		<div class="admin-form-settings__content">
			<!-- Render general settings -->
			<admin-general-settings :info-page="true" />
		</div>
	</div>
</template>

<script setup lang="ts">
import AdminGeneralSettings from './Settings/General/AdminGeneralSettings.vue';
import AdminSettingsSidebar from './Settings/AdminSettingsSidebar.vue';
import { useStore } from 'vuex';
import { IForm, IRootState } from '@/models/IForm';
import { FormType } from '@/models/Enums';
import { computed } from 'vue';
import AdminFormError from './Validation/AdminFormError.vue';

const store = useStore<IRootState>();

const form = computed(() => store.state.form as IForm);
</script>

<style scoped lang="scss">
.admin-form-settings {
	display: flex;
	justify-content: center;

	.space {
		max-width: 350px;
		flex: 1;
		&.space-left {
			flex: 3;
		}
	}

	&__content {
		max-width: 822px;
		width: 70%;
		padding: 40px 0;

		&.link-external > .v-card {
			border-radius: $border-radius;
			margin-bottom: 16px;
			.admin-form-error {
				border-radius: $border-radius;
				border-bottom: none;
			}
		}
	}

	:deep(.card-wrap) {
		.v-col {
			padding: 4px 12px;
		}
	}
}
</style>
