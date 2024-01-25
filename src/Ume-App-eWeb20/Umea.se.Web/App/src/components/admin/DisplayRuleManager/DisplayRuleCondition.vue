<template>
	<div class="display-rule-condition">
		<div class="connection-line"></div>
		<div class="field-wrap large-field">
			<v-select
				v-model="conditionObject.conditionQuestion"
				@update:modelValue="changeQuestion"
				:items="questions"
				item-value="fieldGuid"
				item-title="fieldTitle"
				:return-object="false"
				:label="$t('component.adminDisplayRuleDialog.titleQuestion')"
				color="primary"
			></v-select>
		</div>
		<div class="field-wrap small-field">
			<v-select
				v-model="conditionObject.conditionChoice"
				@update:modelValue="changeChoice"
				:items="choices()"
				item-value="choiceId"
				item-title="choiceTitle"
				:return-object="false"
				label="Välj"
				color="primary"
			></v-select>
		</div>
		<!-- :label="$t('component.adminDisplayRuleDialog.titleChoice')" -->
		<div class="field-wrap large-field" v-if="hasResponse() === 'list'">
			<v-select
				v-model="conditionObject.conditionResponse"
				@update:modelValue="changeResponse"
				:items="
					responses(
						conditionObject.conditionQuestion,
						conditionObject.conditionResponse
					)
				"
				item-value="fieldOptionId"
				item-title="fieldOptionTitle"
				:return-object="false"
				:label="$t('component.adminDisplayRuleDialog.titleResponse')"
				color="primary"
			></v-select>
		</div>
		<div class="field-wrap large-field" v-if="hasResponse() === 'numeric'">
			<v-text-field
				type="number"
				step="0.01"
				v-model="conditionObject.conditionResponse"
				@update:modelValue="changeResponse"
				:label="$t('component.adminDisplayRuleDialog.titleResponse')"
				box
				color="primary"
			>
			</v-text-field>
		</div>
		<div class="field-wrap large-field" v-if="hasResponse() === 'text'">
			<v-text-field
				v-model="conditionObject.conditionResponse"
				@update:modelValue="changeResponse"
				:label="$t('component.adminDisplayRuleDialog.titleResponse')"
				box
			>
			</v-text-field>
		</div>
		<div class="field-wrap large-field" v-if="hasResponse() === '2text'">
			<v-text-field
				v-model="conditionObject.conditionResponse"
				@update:modelValue="changeResponse"
				:label="$t('component.adminDisplayRuleDialog.titleResponse')"
				box
			>
			</v-text-field>
			<v-text-field
				v-model="conditionObject.conditionResponse2"
				@update:modelValue="changeResponse"
				:label="$t('component.adminDisplayRuleDialog.titleResponse')"
				box
			>
			</v-text-field>
		</div>
		<div class="field-wrap large-field" v-if="hasResponse() === ''"></div>
		<v-btn
			class="delete-btn"
			variant="text"
			icon
			@click.prevent="
				deleteCondition(
					displayRuleGroupGuid,
					conditionObject.conditionGuid
				)
			"
		>
			<v-icon color="red">clear</v-icon>
		</v-btn>
	</div>
</template>

<script setup lang="ts">
import { FormFieldType, MutationType, ConditionChoice } from '@/models/Enums';
import {
	IChoice,
	ICondition,
	IDisplayRuleQuestion,
	IDisplayRuleResponse,
	IItem,
	IRootState,
} from '@/models/IForm';
import { computed, inject, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Helper } from '@/utils/helper';
import { getAvailableMetaDataLista } from '@/store/utils';
import IAuthManager from '@/plugins/auth/IAuthManager';
import FormFieldHelper from '@/models/FormFieldHelper';

const props = defineProps({
	fieldId: {
		type: String,
		required: true,
	},
	condition: {
		type: Object as PropType<ICondition>,
		required: true,
	},
	displayRuleGroupGuid: {
		type: String,
		required: true,
	},
});

const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();

const conditionObject = ref<ICondition>(Helper.deepCopy(props.condition));
watch(
	() => props.condition,
	() => {
		conditionObject.value = Helper.deepCopy(props.condition);
	}
);

const availableMetaDataLista = computed(() => {
	const allClientsConfig = auth.getAuthClientsUsedForCitizenLogin();
	return getAvailableMetaDataLista(allClientsConfig);
});

const questions = computed(() => {
	const temp: IDisplayRuleQuestion[] = [];
	if (!store.state.form) {
		return temp;
	}
	store.state.form.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			const fieldtype = field.type.toLowerCase();
			if (
				fieldtype === FormFieldType.CheckBox.toLowerCase() ||
				fieldtype === FormFieldType.RadioButton.toLowerCase() ||
				fieldtype === FormFieldType.SelectList.toLowerCase()
			) {
				if (props.fieldId !== field.id) {
					const tempItems: IItem[] = [];
					(field.fieldOptions.items || []).forEach((item: IItem) => {
						tempItems.push({
							title: item.title,
							isChecked: false,
							value: '',
							id: item.id,
						} as IItem);
					});
					const checked = false;
					temp.push({
						fieldGuid: field.guid,
						fieldTitle: field.title,
						fieldType: field.type.toLowerCase(),
						isChecked: checked,
						responseItems: tempItems,
					} as IDisplayRuleQuestion);
				}
			} else if (fieldtype === FormFieldType.Numeric.toLowerCase()) {
				if (props.fieldId !== field.id.toString()) {
					temp.push({
						fieldGuid: field.guid,
						fieldTitle: field.title,
						fieldType: field.type.toLowerCase(),
						isChecked: false,
					} as IDisplayRuleQuestion);
				}
			}
		});
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	availableMetaDataLista.value.forEach((element: any) => {
		if (element.type === 'array') {
			const tempItems: IItem[] = [];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(element.metaDataList || []).forEach((item: any) => {
				tempItems.push({
					title: item.displayName,
					isChecked: false,
					value: '',
					id: item.name,
				} as IItem);
			});
			const checked = false;
			temp.push({
				fieldGuid: element.guid,
				fieldTitle: element.displayName,
				fieldType: FormFieldType.SelectList.toLowerCase(),
				isChecked: checked,
				responseItems: tempItems,
			} as IDisplayRuleQuestion);
		} else {
			const checked = false;
			temp.push({
				fieldGuid: element.guid,
				fieldTitle: element.displayName,
				fieldType: FormFieldType.Numeric.toLowerCase(),
				isChecked: checked,
			} as IDisplayRuleQuestion);
		}
	});
	return temp;
});

function hasResponse(): string {
	return FormFieldHelper.displayConditionType(conditionObject.value);
}

/**
 * Get possible responses for selected question
 */
function responses(
	conditionQuestion: string,
	conditionResponse: string
): IDisplayRuleResponse[] {
	if (!conditionQuestion) {
		return [] as IDisplayRuleResponse[];
	}
	const temp: IDisplayRuleResponse[] = [];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let selectedItem: any;
	if (!store.state.form) {
		return temp;
	}
	store.state.form.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			if (field.guid === conditionQuestion) {
				selectedItem = field.fieldOptions.items;
			}
		});
	});
	if (selectedItem) {
		selectedItem.forEach((item: IItem) => {
			let checked = false;
			if (conditionResponse === item.id) {
				checked = true;
			}
			const response = {
				fieldOptionId: item.id,
				fieldOptionTitle: item.title,
				isChecked: checked,
			} as IDisplayRuleResponse;
			temp.push(response);
		});
	} else {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		availableMetaDataLista.value.forEach((element: any) => {
			if (element.guid === conditionQuestion) {
				selectedItem = element.metaDataList;
			}
		});
		if (selectedItem) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			selectedItem.forEach((item: any) => {
				let checked = false;
				if (conditionResponse === item.name) {
					checked = true;
				}
				const response = {
					fieldOptionId: item.name,
					fieldOptionTitle: item.displayName,
					isChecked: checked,
				} as IDisplayRuleResponse;
				temp.push(response);
			});
		}
	}
	return temp;
}

function choices(): IChoice[] {
	const choices: IChoice[] = [];
	if (conditionObject.value.conditionQuestionType) {
		Helper.getChoices().forEach((choice) => {
			if (
				choice.choiceType.find(
					(choiceType) =>
						choiceType ===
						conditionObject.value.conditionQuestionType
				)
			) {
				choices.push(choice);
			}
		});
		return choices;
	}
	return Helper.getChoices();
}

function changeQuestion(): void {
	const question = questions.value.find(
		(f) => f.fieldGuid === conditionObject.value.conditionQuestion
	);
	if (question) {
		conditionObject.value.conditionQuestionType = question.fieldType;
		const availableChoices = choices();
		const currentChoiceAvailable = !!availableChoices.find(
			(choice) =>
				choice.choiceId === conditionObject.value.conditionChoice
		);
		if (hasResponse() === 'list') {
			conditionObject.value.conditionResponse = '';
			if (!currentChoiceAvailable) {
				conditionObject.value.conditionChoice = ConditionChoice.Like;
			}
		} else if (hasResponse() === 'numeric') {
			conditionObject.value.conditionResponse = '';
			if (!currentChoiceAvailable) {
				conditionObject.value.conditionChoice = null;
			}
		}
	}
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroupCondition, {
		fieldId: props.fieldId,
		displayRuleGroupGuid: props.displayRuleGroupGuid,
		newValue: conditionObject.value,
		fieldProperty: 'displayRuleGroup',
	});
}

function changeChoice(): void {
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroupCondition, {
		fieldId: props.fieldId,
		displayRuleGroupGuid: props.displayRuleGroupGuid,
		newValue: conditionObject.value,
		fieldProperty: 'displayRuleGroup',
	});
}
function changeResponse(): void {
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroupCondition, {
		fieldId: props.fieldId,
		displayRuleGroupGuid: props.displayRuleGroupGuid,
		newValue: conditionObject.value,
		fieldProperty: 'displayRuleGroup',
	});
}

function deleteCondition(
	displayRuleGroupGuid: string,
	conditionGuid: string
): void {
	store.commit(MutationType.RemoveConditionFromDisplayRuleGroup, {
		fieldId: props.fieldId,
		displayRuleGroupGuid,
		conditionGuid,
		fieldProperty: 'displayRuleGroup',
	});
}
</script>

<style scoped lang="scss">
.display-rule-condition {
	position: relative;
	margin-left: 14px;
	display: flex;
	align-items: center;
	flex-direction: row;
	padding-bottom: 6px;
	padding-top: 6px;

	.field-wrap {
		margin-right: 10px;
		min-width: 72px;

		&.large-field {
			flex: 4;
		}
		&.small-field {
			flex: 4;
		}
		&:nth-child(4n) {
			margin-right: 0;
		}
	}

	.v-col {
		padding: 0;
	}
	.delete-btn {
		border-radius: 20px;
		width: 40px;
		height: 40px;
	}
	.connection-line {
		height: $display-rule-line-thickness;
		width: 14px;
		background-color: $display-rule-line-color;
		position: absolute;
		left: -14px;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
