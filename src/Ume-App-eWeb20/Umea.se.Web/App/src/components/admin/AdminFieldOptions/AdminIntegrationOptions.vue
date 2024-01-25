<template>
	<div class="admin-integration-options">
		<div
			class="integration"
			v-for="integration in activeIntegrations"
			:key="integration.id"
		>
			<div class="integration-text">
				<integration-icon
					class="mr-1 mr-2"
					:integration-type="integration.integrationType"
					:size="30"
				/>
				<div class="fill">
					<h3>
						{{ getTitle(integration) }}
					</h3>
					<p>
						{{ integrationObj(integration.integrationType)?.name }}
					</p>
				</div>
				<div>
					<v-btn
						variant="text"
						@click="openIntegration(integration.id)"
					>
						<v-icon class="mr-1" icon="edit" />{{
							$t('component.adminForm.integrationList.edit')
						}}</v-btn
					>
				</div>
			</div>

			<component
				v-if="
					integrationObj(integration.integrationType)
						?.fieldComponentName
				"
				:is="
					integrationObj(integration.integrationType)
						?.fieldComponentName
				"
				:integration="integration"
				:field="field"
				@save="onSave"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IFormField, IFormIntegration, IRootState } from '@/models/IForm';
import { computed, PropType, inject } from 'vue';
import { useStore } from 'vuex';
import { IIntegrationObject } from '@/plugins/integrations';
import IntegrationIcon from '../Settings/Integration/IntegrationIcon.vue';
import { useRoute, useRouter } from 'vue-router';
import {
	AvailableIntegration,
	FormFieldType,
	MutationType,
} from '@/models/Enums';
import { setIntegrationType } from '@/plugins/integrations/IntegrationUtils';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];

const route = useRoute();
const router = useRouter();

const store = useStore<IRootState>();

const form = computed(() => store.state.form);

const integrationObj = (
	integrationType: AvailableIntegration
): IIntegrationObject | undefined => {
	return registeredIntegrationComponents.find(
		(obj) => obj.integrationType === integrationType
	);
};

const activeIntegrations = computed(() => {
	let integrations = setIntegrationType(
		form.value?.attributes.integrations ?? []
	);

	// Fetch integrations with a fieldComponent
	integrations = integrations.filter((integration) => {
		if (
			integration.integrationType ===
				AvailableIntegration.EmailNotification ||
			integration.integrationType === AvailableIntegration.Email
		) {
			return false;
		}
		const obj = integrationObj(integration.integrationType);
		if (obj?.fieldComponentName) {
			if (obj?.fieldComponentName) {
				if (obj?.fieldComponentTypes) {
					if (
						obj.fieldComponentTypes.includes(
							props.field.type as FormFieldType
						)
					) {
						return true;
					}
				} else if (
					props.field.type !== FormFieldType.Table &&
					props.field.type !== FormFieldType.Section
				) {
					return true;
				}
			}
		}
		return false;
	});

	return integrations;
});

const getTitle = (integration: IFormIntegration): string => {
	return (
		integration.options.find((option) => option.key === 'title')?.value ??
		''
	);
};

const onSave = (integration: IFormIntegration): void => {
	store.commit(MutationType.UpdateFormIntegration, {
		integrationId: integration.id,
		newValue: integration,
	});
};

const openIntegration = async (integrationId: number): Promise<void> => {
	await router.push({
		name: 'AdminForm.Settings.Integration',
		params: { formId: route.params.formId },
		query: { integrationId },
	});
};
</script>

<style scoped lang="scss">
.admin-integration-options {
	.integration {
		margin: 10px 0;
		margin-bottom: 30px;
		padding: 0 24px;
		color: $black;

		border-left: solid $primary 2px;

		.integration-text {
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			.fill {
				flex: auto;
			}

			p {
				margin-bottom: 0;
				font-size: size(14);
			}
		}
	}
}
</style>
