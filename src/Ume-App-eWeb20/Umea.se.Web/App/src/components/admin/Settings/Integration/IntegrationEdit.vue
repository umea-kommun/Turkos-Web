<template>
	<v-dialog
		v-model="showModal"
		scrollable
		width="800"
		@click:outside="closeDialog"
		:persistent="true"
		:retain-focus="retainDialogFocus"
	>
		<div class="integration-edit">
			<Form as="" ref="integrationForm" v-slot="{ errors }">
				<v-card v-if="integrationEdit">
					<v-card-title>
						{{ modalTitle }}
						<v-btn
							variant="plain"
							class="refresh-btn"
							@click.prevent="refreshData()"
							v-if="hasRefresh"
						>
							<v-icon icon="refresh" />
						</v-btn>
					</v-card-title>
					<integration-edit-errors
						:errors="errors"
						@change-tab="(tab) => (activeTab = tab)"
					/>
					<v-tabs
						v-if="tabs.length"
						v-model="activeTab"
						slider-color="primary"
					>
						<v-tab
							tabindex="0"
							v-for="(tab, index) in tabs"
							:value="index"
							:key="tab"
						>
							{{ tab }}
						</v-tab>
					</v-tabs>
					<v-divider></v-divider>
					<v-card-text
						:class="{ errors: !!Object.keys(errors).length }"
					>
						<component
							ref="integrationComponent"
							:is="
								getComponentName(
									integrationEdit.integrationType
								)
							"
							v-model="integrationEdit"
							:isNew="isNew ?? undefined"
							:activeTab="tabs.length ? activeTab : undefined"
						>
							{{
								'Denna integration är inte implementerad i Admin 2.0 än.'
							}}
						</component>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-btn variant="text" @click="showModal = false">
							{{
								$t('component.adminForm.integrationEdit.cancel')
							}}
						</v-btn>
						<v-btn
							color="primary"
							variant="text"
							@click="onSave"
							:disabled="!canSave || !!Object.keys(errors).length"
						>
							{{
								isNew
									? $t(
											'component.adminIntegration' +
												integrationEdit.integrationType +
												'.create'
									  )
									: $t(
											'component.adminForm.integrationEdit.save'
									  )
							}}
						</v-btn>
					</v-card-actions>
				</v-card>
			</Form>
		</div>
	</v-dialog>
</template>

<script setup lang="ts">
import { IFormIntegrationTyped } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { PropType, ref, computed, watch, inject } from 'vue';
import { useTConfirmDialog } from '@turkos/components';
import { useI18n } from 'vue-i18n';
import { IIntegrationObject } from '@/plugins/integrations';
import { Form } from 'vee-validate';
import IntegrationEditErrors from './IntegrationEditErrors.vue';
import { AvailableIntegration } from '@/models/Enums';

const props = defineProps({
	integration: Object as PropType<IFormIntegrationTyped | null>,
});
const emit = defineEmits(['save', 'close']);

const { t } = useI18n();

const retainDialogFocus = ref(true); // Keep focus inside dialog
const integrationEdit = ref<IFormIntegrationTyped | null>(null);
watch(
	() => props.integration,
	() => {
		if (props.integration) {
			retainDialogFocus.value = true;
			integrationEdit.value = Helper.deepCopy(props.integration);
		} else {
			integrationEdit.value = null;
		}
	}
);

const showModal = computed({
	get: () => !!props.integration,
	set: (show: boolean) => {
		if (!show) {
			emit('close');
		}
	},
});

const modalTitle = computed(() => {
	if (integrationEdit.value) {
		return t(
			'component.adminIntegration' +
				integrationEdit.value.integrationType +
				'.modalTitle'
		);
	}
	return '';
});

const isNew = computed(() => !integrationEdit.value?.id);

const integrationComponent = ref(null);
const canSave = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const valid = (integrationComponent.value as any)?.isValid ?? true;

	const edited =
		JSON.stringify(props.integration) !==
		JSON.stringify(integrationEdit.value);

	return valid && edited;
});
const integrationForm = ref();
const onSave = async (): Promise<void> => {
	const formValid = (await integrationForm.value?.validate())?.valid ?? false;

	if (canSave.value && formValid) {
		emit('save', integrationEdit.value);
		emit('close');
	}
};

const { tConfirmDialogAsync } = useTConfirmDialog();
const closeDialog = async (): Promise<void> => {
	const edited =
		JSON.stringify(props.integration) !==
		JSON.stringify(integrationEdit.value);

	if (edited) {
		retainDialogFocus.value = false; // Don't keep focus inside dialog since we have to focus the confirm dialog
		const keepChanges = await tConfirmDialogAsync(
			t('component.adminForm.integrationEdit.keepChangesModal.title'),
			t('component.adminForm.integrationEdit.keepChangesModal.text'),
			{
				text: t(
					'component.adminForm.integrationEdit.keepChangesModal.yes'
				),
				color: 'primary',
			},
			{
				text: t(
					'component.adminForm.integrationEdit.keepChangesModal.no'
				),
			}
		);
		if (keepChanges) {
			await onSave();
			return;
		}
	}
	showModal.value = false;
};

const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];
const getComponentName = (type: AvailableIntegration): string => {
	for (const component of registeredIntegrationComponents) {
		if (component.integrationType === type) {
			return component.componentName;
		}
	}
	return '';
};

// If the integration wants to use tabs, we retrieve them from the integration
const tabs = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (integrationComponent.value as any)?.tabs ?? [];
});
const activeTab = ref(0);

const hasRefresh = computed(() => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (integrationComponent.value as any)?.refresh ? true : false;
});

function refreshData(): void {
	(integrationComponent.value as any)?.refresh();
}
</script>

<style scoped lang="scss">
.integration-edit {
	.v-card {
		max-height: calc(100vh - 48px);
		display: flex;
		flex-direction: column;
	}
	.v-tabs {
		flex: 1;
		min-height: 48px;

		:deep(.v-slide-group__content) {
			justify-content: center;
		}
		.v-tab {
			margin: 0;
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
	:deep(.v-col) {
		padding-bottom: 0;
		padding-top: 0;
	}
	.v-card-title {
		font-size: size(18);
		font-weight: bold;
		display: flex;
		justify-content: space-between;
	}
	.v-card-text {
		overflow-y: auto;
	}
	.v-card-actions {
		align-items: center;
		justify-content: flex-end;
		display: flex;
	}
	.refresh-btn {
		margin: 0px;
		padding: 0px;
		min-width: 16px;

		.v-icon {
			margin-right: 4px;
		}
	}
}
</style>
