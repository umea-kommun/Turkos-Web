<template>
	<div class="admin-email-settings">
		<h1>
			{{ $t('component.adminForm.adminSettingsSidebar.email') }}
		</h1>

		<integration-edit
			:integration="editingIntegration"
			@close="editingIntegration = null"
			@save="onSave"
		/>

		<div class="card-wrap">
			<v-card>
				<v-row class="mb-3">
					<v-col>
						<integration-list
							id="emailNotifications"
							:title="
								$t(
									'component.adminIntegrationEmailNotification.name'
								)
							"
							:description="
								$t(
									'component.adminIntegrationEmailNotification.description'
								)
							"
							:integrations="emailNotifications"
							:add-text="
								emailNotifications.length === 0
									? $t(
											'component.adminIntegrationEmailNotification.create'
									  )
									: ''
							"
							:add-type="AvailableIntegration.EmailNotification"
							@edit="onEdit"
							@delete="onDelete"
						/>
					</v-col>
				</v-row>
				<v-row>
					<v-col>
						<integration-list
							id="emailIntegrations"
							:title="$t('component.adminIntegrationEmail.name')"
							:description="
								$t(
									'component.adminIntegrationEmail.description'
								)
							"
							:integrations="emailIntegrations"
							:add-text="
								$t('component.adminIntegrationEmail.create')
							"
							:add-type="AvailableIntegration.Email"
							@edit="onEdit"
							@delete="onDelete"
						/>
					</v-col>
				</v-row>
			</v-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IFormIntegrationTyped, IRootState } from '@/models/IForm';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import IntegrationList from './IntegrationList.vue';
import IntegrationEdit from './IntegrationEdit.vue';
import { AvailableIntegration, MutationType } from '@/models/Enums';
import { setIntegrationType } from '@/plugins/integrations/IntegrationUtils';

const store = useStore<IRootState>();

const form = computed(() => store.state.form);

const emailNotifications = computed(() => {
	const integrations = setIntegrationType(
		form.value?.attributes.integrations ?? []
	);

	return (
		integrations.filter(
			(integration) =>
				integration.integrationType ===
				AvailableIntegration.EmailNotification
		) ?? []
	);
});

const emailIntegrations = computed(() => {
	const integrations = setIntegrationType(
		form.value?.attributes.integrations ?? []
	);

	return (
		integrations.filter(
			(integration) =>
				integration.integrationType === AvailableIntegration.Email
		) ?? []
	);
});

const editingIntegration = ref<IFormIntegrationTyped | null>(null);
const onEdit = (integration: IFormIntegrationTyped): void => {
	editingIntegration.value = integration;
};

const onSave = (integration: IFormIntegrationTyped): void => {
	store.commit(MutationType.UpdateFormIntegration, {
		integrationId: integration.id,
		newValue: integration,
	});
};
const onDelete = (integration: IFormIntegrationTyped): void => {
	store.commit(MutationType.DeleteFormIntegration, {
		integrationId: integration.id,
	});
};
</script>

<style scoped lang="scss">
.admin-email-settings {
	h1 {
		color: $black;
	}
	:deep(.card-wrap) {
		margin-top: 20px;

		h2 {
			color: $black;
			margin-bottom: 10px;
			font-size: size(20);
		}
		.v-card {
			padding: 16px;
			border-radius: $border-radius;
		}
	}
}
</style>
