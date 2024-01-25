<template>
	<div class="integration-list">
		<label :id="id + '-title'">{{ title }}</label>
		<p class="description">{{ description }}</p>
		<v-list :aria-labelledby="id + '-title'">
			<v-list-item
				v-for="integration in integrations"
				:key="integration.id"
				@click="onEdit(integration)"
				:id="'integration-' + integration.id"
			>
				<v-list-item-title>
					<integration-icon
						class="mr-2"
						:integration-type="integration.integrationType"
					/>
					{{ integrationTitle(integration.options) }}
				</v-list-item-title>

				<v-list-item-action>
					<v-btn variant="text">
						<v-icon icon="edit" />
						{{ $t('component.adminForm.integrationList.edit') }}
					</v-btn>

					<v-btn
						variant="text"
						class="delete"
						@click.stop="onDelete(integration)"
					>
						<v-icon icon="delete_outline" />
						{{ $t('component.adminForm.integrationList.delete') }}
					</v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list>
		<v-btn
			v-if="addText && addType"
			variant="text"
			class="add-button"
			@click="onAdd(addType)"
		>
			<v-icon icon="add" />
			{{ addText }}
		</v-btn>
	</div>
</template>

<script setup lang="ts">
import {
	IFormIntegration,
	IFormIntegrationOption,
	IFormIntegrationTyped,
} from '@/models/IForm';
import { useTConfirmDialog } from '@turkos/components';
import { PropType, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { IIntegrationObject } from '@/plugins/integrations';
import IntegrationIcon from './IntegrationIcon.vue';
import { AvailableIntegration } from '@/models/Enums';

defineProps({
	id: {
		type: String,
		required: true,
	},
	integrations: {
		type: Array as PropType<IFormIntegrationTyped[]>,
		default: () => [],
	},
	title: String,
	description: String,
	addText: String,
	addType: String as PropType<AvailableIntegration>,
});
const emit = defineEmits(['add', 'edit', 'delete']);

const { t } = useI18n();

const integrationTitle = (options: IFormIntegrationOption[]): string => {
	for (const option of options) {
		if (option.key === 'title') {
			return option.value;
		}
	}
	return '';
};
const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];

const onEdit = (integration: IFormIntegrationTyped): void => {
	emit('edit', integration);
};

const onAdd = (integrationType: AvailableIntegration): void => {
	const integrationObject = registeredIntegrationComponents.find(
		(integration) => integration.integrationType === integrationType
	);

	emit('edit', {
		...integrationObject,
		options: [],
		id: 0,
	} as IFormIntegration);
};

const { tConfirmDialogAsync } = useTConfirmDialog();
const onDelete = async (integration: IFormIntegrationTyped): Promise<void> => {
	const doRemove = await tConfirmDialogAsync(
		t(
			'component.adminIntegration' +
				integration.integrationType +
				'.confirmDelete.title'
		),
		t(
			'component.adminIntegration' +
				integration.integrationType +
				'.confirmDelete.text'
		),
		{
			text: t('component.adminForm.integrationList.delete'),
			color: 'error',
		}
	);
	if (doRemove) {
		emit('delete', integration);
	}
};
</script>

<style scoped lang="scss">
.integration-list {
	flex: 1;

	label {
		font-weight: bold;
		font-size: size(18);
	}
	.description {
		opacity: 0.8;
		margin: 0;
	}
	.v-list-item {
		background-color: $grey-lighten-3;
		padding: 0;
		padding-right: 0 !important;
		border-radius: $border-radius;
		&:not(:last-child) {
			margin-bottom: 14px;
		}

		.v-btn {
			&.delete {
				color: $error;
			}

			.v-icon {
				margin-right: 6px;
			}
		}

		:deep(.v-list-item__content) {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.add-button {
		color: $primary;
		padding-left: 12px;
		margin: 0;

		.v-icon {
			margin-right: 4px;
		}
	}
}
</style>
