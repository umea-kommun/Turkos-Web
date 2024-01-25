<template>
	<div class="admin-integration-settings">
		<h1>
			{{ $t('component.adminForm.adminSettingsSidebar.integration') }}
		</h1>

		<integration-edit
			:integration="editingIntegration"
			@close="editingIntegration = null"
			@save="onSave"
		/>

		<div class="card-wrap">
			<v-card>
				<v-row v-if="activeIntegrations?.length" class="mb-3">
					<v-col>
						<integration-list
							id="activeIntegrations"
							:title="
								$t(
									'component.adminIntegration.activeIntegrations'
								)
							"
							:integrations="activeIntegrations"
							@edit="onEdit"
							@delete="onDelete"
						/>
					</v-col>
				</v-row>
				<v-row class="mb-3">
					<v-col>
						<h2>
							{{
								$t(
									'component.adminIntegration.availableIntegrations'
								)
							}}
						</h2>
						<div
							v-for="integration in integrations"
							:key="integration.integrationType"
							class="integration"
						>
							<integration-icon
								:integration-type="integration.integrationType"
								:size="46"
							/>
							<div class="text-wrap">
								<h3>{{ integration.name }}</h3>
								<p>{{ integration.description }}</p>
							</div>
							<v-btn
								color="primary"
								class="add-btn"
								@click="onAdd(integration.integrationType)"
								variant="flat"
								:disabled="
									integrationLimitReached(
										integration.integrationType
									)
								"
							>
								<span
									v-if="
										!integrationLimitReached(
											integration.integrationType
										)
									"
								>
									<v-icon icon="add" />
									{{
										$t('component.adminIntegration.addNew')
									}}
								</span>
								<span v-else>
									{{
										$t(
											'component.adminIntegration.addNewDisabled'
										)
									}}
								</span>
							</v-btn>
						</div>
					</v-col>
				</v-row>
			</v-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IFormIntegrationTyped, IRootState } from '@/models/IForm';
import { computed, ref, inject, onMounted } from 'vue';
import { useStore } from 'vuex';
import IntegrationList from './IntegrationList.vue';
import IntegrationEdit from './IntegrationEdit.vue';
import { IIntegrationObject } from '@/plugins/integrations';
import { useI18n } from 'vue-i18n';
import IntegrationIcon from './IntegrationIcon.vue';
import { useRoute } from 'vue-router';
import { AvailableIntegration, MutationType } from '@/models/Enums';
import { setIntegrationType } from '@/plugins/integrations/IntegrationUtils';

const route = useRoute();
const store = useStore<IRootState>();

const { t } = useI18n();

const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];

const form = computed(() => store.state.form);

const integrations = computed(() => {
	const integrations = registeredIntegrationComponents
		.filter(
			(integration) =>
				integration.integrationType !==
					AvailableIntegration.EmailNotification &&
				integration.integrationType !== AvailableIntegration.Email
		)
		.map((integration) => ({
			...integration,
			description: t(
				'component.adminIntegration' +
					integration.integrationType +
					'.description'
			),
		}));
	return integrations;
});

const activeIntegrations = computed(() => {
	let integrations = setIntegrationType(
		form.value?.attributes.integrations ?? []
	);

	integrations =
		integrations.filter(
			(integration) =>
				integration.integrationType !==
					AvailableIntegration.EmailNotification &&
				integration.integrationType !== AvailableIntegration.Email
		) ?? [];

	return integrations;
});

const integrationLimitReached = (
	integrationType: AvailableIntegration
): boolean => {
	if (
		integrationType === AvailableIntegration.EcosIntegration &&
		activeIntegrations.value.find(
			(integration) =>
				integration.integrationType ===
				AvailableIntegration.EcosIntegration
		)
	) {
		return true;
	}
	return false;
};

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
	if (integration.integrationType === AvailableIntegration.EcosIntegration) {
		store.dispatch('onPremIntegration/clearEcosData');
	}

	store.commit(MutationType.DeleteFormIntegration, {
		integrationId: integration.id,
	});
};

const onAdd = (integrationType: AvailableIntegration): void => {
	const integrationObject = registeredIntegrationComponents.find(
		(integration) => integration.integrationType === integrationType
	);

	if (integrationObject) {
		const integration: IFormIntegrationTyped = {
			id: 0,
			type: integrationObject.type,
			integrationType,
			options: [],
		};

		onEdit(integration);
	}
};

onMounted(() => {
	if (route.query.integrationId) {
		// Open up integration modal if integration id is passed in the url
		const id = parseInt(route.query.integrationId as string);
		setTimeout(() => {
			const integration = activeIntegrations.value.find(
				(integration) => integration.id === id
			);
			if (integration) {
				onEdit(integration);
			}
		}, 100);
	}
});
</script>

<style scoped lang="scss">
.admin-integration-settings {
	h1 {
		color: $black;
	}
	:deep(.card-wrap) {
		margin-top: 20px;

		h2 {
			color: $black;
			margin-bottom: 10px;
			font-size: size(18);
		}
		.v-card {
			padding: 16px;
			border-radius: $border-radius;
		}
	}

	.v-col > h3 {
		color: $black;
		font-weight: bold;
		font-size: size(18);
		margin-bottom: 8px;
	}

	.integration {
		display: flex;
		flex-direction: row;
		margin-bottom: 14px;

		padding: 12px;
		border-radius: $border-radius;
		background-color: $grey-lighten-3;
		color: $black;

		.v-avatar {
			margin: 10px;
			margin-top: 4px;
		}
		.text-wrap {
			flex: 1;
			padding: 0 12px;

			h3 {
				font-size: size(16);
			}
			p {
				margin-bottom: 10px;
			}
		}
		.v-btn {
			align-items: center;
			.v-icon {
				margin-right: 4px;
			}
		}
	}
}
</style>
