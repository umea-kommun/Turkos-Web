<template>
	<div class="display-rule-manager">
		<v-card v-if="isMother" class="mother-fields" flat>
			<!-- 
				Im not sure how we should display fields that are depending on this one yet.
				So this v-card is temporary and will be looked into later
			-->
			<v-list-item-title class="display-rule-title">
				Andra fält visas beroende på val i detta fält
			</v-list-item-title>
			<v-list>
				<v-list-item
					v-for="displayRuleMother in showAllMotherRules
						? displayRulesMother
						: displayRulesMother.slice(0, SHOW_MOTHER_RULES_COUNT)"
					:key="
						displayRuleMother.fieldTitle +
						displayRuleMother.fieldOptionTitle
					"
					link
					@click="openField(displayRuleMother.fieldId)"
					:title="displayRuleMother.fieldTitle"
				>
					<v-list-item-subtitle>
						{{ displayRuleMother.conditionText }}
					</v-list-item-subtitle>
				</v-list-item>
			</v-list>
			<v-btn
				v-if="
					!showAllMotherRules &&
					displayRulesMother.length > SHOW_MOTHER_RULES_COUNT
				"
				flat
				@click="showAllMotherRules = true"
				>Visa alla
				{{ displayRulesMother.length }}
				fält</v-btn
			>
		</v-card>
		<div>
			<div>
				<admin-switch
					:id="props.field.id + '-displayRulesToggle'"
					:model-value="
						displayRuleGroup &&
						displayRuleGroup.displayRuleGroupGuid
							? true
							: false
					"
					@update:model-value="
						(useDisplayRules) =>
							useDisplayRules
								? addDisplayRuleGroup()
								: deleteDisplayRuleGroup()
					"
					:label="$t('component.adminDisplayRule.title')"
					:help-text="$t('component.adminDisplayRule.helpText')"
					:show-button="true"
				/>
			</div>
			<div>
				<div
					v-if="
						displayRuleGroup &&
						displayRuleGroup.displayRuleGroupGuid
					"
				>
					<div class="query-option">
						<div>
							{{ $t('component.adminDisplayRule.queryPrefix') }}
						</div>
						<v-select
							v-model="selectedQueryOption"
							:items="queryOption()"
							item-value="queryOptionId"
							item-title="queryOptionTitle"
							:return-object="false"
							density="compact"
							color="primary"
						></v-select>
						<div>
							{{ $t('component.adminDisplayRule.querySuffix') }}
						</div>
					</div>
					<div class="conditions-wrap">
						<template
							v-for="condition in displayRuleGroup.conditions"
							:key="condition.conditionGuid"
						>
							<display-rule-condition
								:fieldId="field.id.toString()"
								:condition="condition"
								:displayRuleGroupGuid="
									displayRuleGroup.displayRuleGroupGuid
								"
							/>
						</template>
						<template
							v-for="group in displayRuleGroup.groups"
							:key="group.displayRuleGroupGuid"
						>
							<display-rule-group-component
								:fieldId="field.id.toString()"
								:group="group"
								:parentDisplayRuleGroupGuid="
									displayRuleGroup.displayRuleGroupGuid
								"
							/>
						</template>
					</div>
					<v-card-actions>
						<div class="connection-turn"></div>
						<v-btn
							color="primary"
							flat
							@click.prevent="
								addCondition(
									displayRuleGroup.displayRuleGroupGuid
								)
							"
						>
							<v-icon :size="20">add</v-icon>
							<span>{{
								$t('component.adminDisplayRuleGroup.rule')
							}}</span>
						</v-btn>
						<v-btn
							color="primary"
							flat
							@click.prevent="
								addGroup(displayRuleGroup.displayRuleGroupGuid)
							"
						>
							<v-icon :size="20">add</v-icon>
							<span>{{
								$t('component.adminDisplayRuleGroup.group')
							}}</span>
						</v-btn>
					</v-card-actions>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MutationType, ConditionChoice, QueryOption } from '@/models/Enums';
import {
	ICondition,
	IDisplayRuleGroup,
	IDisplayRuleMother,
	IFormField,
	IItem,
	IQueryOption,
	IRootState,
} from '@/models/IForm';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import DisplayRuleCondition from '@/components/admin/DisplayRuleManager/DisplayRuleCondition.vue';
import DisplayRuleGroupComponent from '@/components/admin/DisplayRuleManager/DisplayRuleGroup.vue';
import { computed, PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Helper } from '@/utils/helper';
import { useTConfirmDialog } from '@turkos/components';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
});

const store = useStore<IRootState>();
const { t } = useI18n();

function saveUpdatedFormField(
	fieldId: string,
	newValue: unknown,
	fieldProperty: string
): void {
	store.commit(MutationType.UpdateFormField, {
		fieldId,
		newValue,
		fieldProperty,
	});
}

const displayRuleGroup = computed(() => {
	if (props.field.displayRuleGroup) {
		return Helper.deepCopy(props.field.displayRuleGroup);
	}
	return {} as IDisplayRuleGroup;
});

function addDisplayRuleGroup(): void {
	const displayRuleGroupGuid = Helper.generateUuid();
	if (
		!displayRuleGroup.value ||
		(displayRuleGroup.value && !displayRuleGroup.value.displayRuleGroupGuid)
	) {
		const newDisplayRuleGroup = {
			displayRuleGroupGuid,
			queryOption: QueryOption.And,
			conditions: [],
			groups: [],
		} as IDisplayRuleGroup;
		newDisplayRuleGroup.conditions.push({
			conditionGuid: Helper.generateUuid(),
			conditionQuestion: '',
			conditionChoice: ConditionChoice.Like,
			conditionResponse: '',
		} as ICondition);

		saveUpdatedFormField(
			props.field.id,
			newDisplayRuleGroup,
			'displayRuleGroup'
		);
	}
}

function addGroup(displayRuleGroupGuid: string): void {
	const newDisplayRuleGroup = {
		displayRuleGroupGuid: Helper.generateUuid(),
		queryOption: QueryOption.And,
		conditions: [],
		groups: [],
	} as IDisplayRuleGroup;
	newDisplayRuleGroup.conditions.push({
		conditionGuid: Helper.generateUuid(),
		conditionQuestion: '',
		conditionChoice: ConditionChoice.Like,
		conditionResponse: '',
	} as ICondition);

	store.commit(MutationType.UpdateFormFieldDisplayRuleGroup, {
		fieldId: props.field.id,
		displayRuleGroupGuid,
		newValue: newDisplayRuleGroup,
		fieldProperty: 'displayRuleGroup',
	});
}

function addCondition(displayRuleGroupGuid: string): void {
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroupCondition, {
		fieldId: props.field.id,
		displayRuleGroupGuid,
		newValue: {
			conditionGuid: Helper.generateUuid(),
			conditionQuestion: '',
			conditionChoice: ConditionChoice.Like,
			conditionResponse: '',
		} as ICondition,
		fieldProperty: 'displayRuleGroup',
	});
}

const { tConfirmDialogAsync } = useTConfirmDialog();
async function deleteDisplayRuleGroup(): Promise<void> {
	const emptyGroup =
		displayRuleGroup.value.conditions.length === 0 &&
		displayRuleGroup.value.groups.length === 0;

	let deleteGroup = emptyGroup;
	if (!emptyGroup) {
		// Confirm removal if there is existing display rules
		deleteGroup = await tConfirmDialogAsync(
			t('component.adminDisplayRule.disableConfirm.title'),
			t('component.adminDisplayRule.disableConfirm.text'),
			{
				text: t('component.adminDisplayRule.disableConfirm.buttonText'),
				color: 'error',
			}
		);
	}
	if (deleteGroup) {
		// this.displayRuleGroup = {} as IDisplayRuleGroup;
		store.commit(MutationType.UpdateFormField, {
			fieldId: props.field.id,
			newValue: {} as IDisplayRuleGroup,
			fieldProperty: 'displayRuleGroup',
		});
	}
}

function queryOption(): IQueryOption[] {
	return Helper.getQueryOption();
}

const selectedQueryOption = computed({
	get: () => {
		return displayRuleGroup.value.queryOption;
	},
	set: (newValue: string) => {
		store.commit(MutationType.UpdateFormFieldDisplayRuleGroupQueryOption, {
			fieldId: props.field.id,
			displayRuleGroupGuid: displayRuleGroup.value.displayRuleGroupGuid,
			newValue,
			fieldProperty: 'displayRuleGroup',
		});
	},
});

function checkMotherConditions(
	conditions: ICondition[],
	field: IFormField,
	temp: IDisplayRuleMother[]
): void {
	conditions.forEach((condition) => {
		if (condition.conditionQuestion === props.field.guid) {
			const displayRuleMother = {
				fieldTitle: field.title,
				fieldId: field.id,
			} as IDisplayRuleMother;
			if (
				props.field.fieldOptions?.items &&
				condition.conditionResponse
			) {
				props.field.fieldOptions?.items.forEach((item: IItem) => {
					if (item.id === condition.conditionResponse) {
						displayRuleMother.fieldOptionTitle = item.title ?? '';
					}
				});
				Helper.getChoices().forEach((choice) => {
					if (choice.choiceId === condition.conditionChoice) {
						displayRuleMother.choice = choice.choiceTitle;
					}
				});
				displayRuleMother.conditionText = t(
					'component.adminDisplayRule.conditionText.items',
					[
						displayRuleMother.choice.toLowerCase(),
						displayRuleMother.fieldOptionTitle,
					]
				);
			} else {
				Helper.getChoices().forEach((choice) => {
					if (choice.choiceId === condition.conditionChoice) {
						displayRuleMother.choice = choice.choiceTitle;
						displayRuleMother.fieldOptionTitle =
							condition.conditionResponse;

						displayRuleMother.conditionText = t(
							'component.adminDisplayRule.conditionText.single',
							[
								displayRuleMother.choice.toLowerCase(),
								displayRuleMother.fieldOptionTitle,
							]
						);
					}
				});
			}
			temp.push(displayRuleMother);
		}
	});
}

function checkMotherGroups(
	groups: IDisplayRuleGroup[],
	field: IFormField,
	temp: IDisplayRuleMother[]
): void {
	groups.forEach((group) => {
		checkMotherConditions(group.conditions, field, temp);
		if (group.groups.length > 0) {
			checkMotherGroups(group.groups, field, temp);
		}
	});
}

const SHOW_MOTHER_RULES_COUNT = 3;
const showAllMotherRules = ref(false);
const displayRulesMother = computed(() => {
	const temp: IDisplayRuleMother[] = [];
	if (store.state.form?.attributes.steps.length) {
		store.state.form.attributes.steps.forEach((step) => {
			step.fields.forEach((field) => {
				if (
					field.displayRuleGroup &&
					field.displayRuleGroup.displayRuleGroupGuid
				) {
					checkMotherConditions(
						field.displayRuleGroup.conditions,
						field,
						temp
					);
					if (field.displayRuleGroup.groups.length > 0) {
						checkMotherGroups(
							field.displayRuleGroup.groups,
							field,
							temp
						);
					}
				}
			});
		});
	}
	return temp;
});

const isMother = computed(() => displayRulesMother.value.length > 0);

const openField = (fieldId: string): void => {
	if (store.state.form) {
		for (const stepIndex in store.state.form.attributes.steps) {
			for (const field of store.state.form.attributes.steps[stepIndex]
				.fields) {
				if (field.id === fieldId) {
					store.commit(MutationType.UpdateAdminState, {
						prop: 'activeFieldId',
						value: fieldId,
					});
					store.commit(MutationType.UpdateAdminState, {
						prop: 'activeStep',
						value: parseInt(stepIndex) + 1,
					});
					setTimeout(() => {
						document
							.getElementById('field-preview-' + fieldId)
							?.scrollIntoView();
					});
					break;
				}
			}
		}
	}
};
</script>

<style scoped lang="scss">
.display-rule-manager {
	/* :deep styling also affects child components */
	:deep(.v-btn) {
		text-transform: none;
	}
	:deep(.query-option) {
		display: flex;
		flex-direction: row;
		align-items: center;

		--v-input-padding-top: 5px;

		.v-select {
			flex: inherit;
			margin: 0 6px;

			.v-field {
				padding-right: 4px;

				&__field {
					padding: 4px 0px !important;
				}
			}

			.v-field__input {
				padding: initial !important;
				padding-top: 0 !important;
				padding-left: 10px !important;
				min-height: auto;
			}
		}
	}

	:deep(.v-input) {
		.v-input__details {
			display: none;
		}
		--v-input-padding-top: 5px;
		div.v-field {
			align-items: center;
			&__field {
				padding-top: 5px !important;
			}
		}
		.v-field__append-inner {
			padding: 0;
		}
		.v-field__input {
			min-height: 40px;
			.v-select__selection {
				margin-left: 0 !important;
			}
		}
		.v-field__field {
			padding-left: 8px;
		}
	}

	.query-option {
		.v-select {
			text-transform: lowercase;
		}
	}

	.conditions-wrap {
		padding-top: 20px;
		border-left: solid $display-rule-line-thickness $display-rule-line-color;
	}

	:deep(.v-select__selection) {
		padding-top: 0px !important;
		padding-bottom: 0px !important;
	}

	:deep(.v-card-actions) {
		position: relative;
		padding: 0;
		padding-left: 14px;

		.v-btn .v-icon {
			margin-right: 6px;
		}
		.connection-turn {
			position: absolute;
			left: 0;
			top: 0;
			border-left: solid $display-rule-line-thickness
				$display-rule-line-color;
			height: 50%;
			width: 14px;
			border-bottom: solid $display-rule-line-thickness
				$display-rule-line-color;
		}
	}

	.mother-fields {
		padding: 10px;
		border: solid 1px $grey-lighten-4;
		border-radius: $border-radius;
		margin-bottom: 10px;
	}
}
</style>
