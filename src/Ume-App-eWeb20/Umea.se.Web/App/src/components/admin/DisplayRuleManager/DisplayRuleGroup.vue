<template>
	<div class="display-rule-group">
		<div class="connection-line"></div>
		<div class="display-rule-group__content">
			<div class="display-rule-group__top">
				<div class="query-option">
					<v-select
						v-model="groupObject.queryOption"
						@update:modelValue="changeQueryOption"
						:items="queryOption()"
						item-value="queryOptionId"
						item-title="queryOptionTitle"
						:return-object="false"
						color="primary"
					></v-select>
					<div>
						{{ $t('component.adminDisplayRule.querySuffix') }}
					</div>
				</div>
				<v-btn
					class="delete-button"
					variant="text"
					color="red"
					@click.prevent="
						deleteGroup(groupObject.displayRuleGroupGuid)
					"
				>
					<v-icon :size="20">delete</v-icon>
					<span>{{
						$t('component.adminDisplayRuleGroup.delete')
					}}</span>
				</v-btn>
			</div>
			<div class="conditions-wrap">
				<template
					v-for="condition in groupObject.conditions"
					:key="condition.conditionGuid"
				>
					<display-rule-condition
						:fieldId="fieldId"
						:condition="condition"
						:displayRuleGroupGuid="groupObject.displayRuleGroupGuid"
					/>
				</template>
				<template
					v-for="group2 in groupObject.groups"
					:key="group2.displayRuleGroupGuid"
				>
					<display-rule-group
						:fieldId="fieldId"
						:group="group2"
						:parentDisplayRuleGroupGuid="
							groupObject.displayRuleGroupGuid
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
						addCondition(groupObject.displayRuleGroupGuid)
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
					@click.prevent="addGroup(groupObject.displayRuleGroupGuid)"
				>
					<v-icon :size="20">add</v-icon>
					<span>{{
						$t('component.adminDisplayRuleGroup.group')
					}}</span>
				</v-btn>
			</v-card-actions>
		</div>
	</div>
</template>

<script setup lang="ts">
import { MutationType, ConditionChoice, QueryOption } from '@/models/Enums';
import {
	ICondition,
	IDisplayRuleGroup,
	IQueryOption,
	IRootState,
} from '@/models/IForm';
import { PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { Helper } from '@/utils/helper';
import { useTConfirmDialog } from '@turkos/components';
import DisplayRuleCondition from '@/components/admin/DisplayRuleManager/DisplayRuleCondition.vue';

const props = defineProps({
	fieldId: {
		type: String,
		required: true,
	},
	group: {
		type: Object as PropType<IDisplayRuleGroup>,
		required: true,
	},
	parentDisplayRuleGroupGuid: {
		type: String,
		required: true,
	},
});

const store = useStore<IRootState>();
const { t } = useI18n();

const groupObject = ref<IDisplayRuleGroup>(Helper.deepCopy(props.group));
watch(
	() => props.group,
	() => {
		groupObject.value = Helper.deepCopy(props.group);
	}
);

function changeQueryOption(): void {
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroup, {
		fieldId: props.fieldId,
		displayRuleGroupGuid: props.parentDisplayRuleGroupGuid,
		newValue: groupObject.value,
		fieldProperty: 'displayRuleGroup',
	});
}

function queryOption(): IQueryOption[] {
	return Helper.getQueryOption();
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
		fieldId: props.fieldId,
		displayRuleGroupGuid,
		newValue: newDisplayRuleGroup,
		fieldProperty: 'displayRuleGroup',
	});
}

function addCondition(displayRuleGroupGuid: string): void {
	store.commit(MutationType.UpdateFormFieldDisplayRuleGroupCondition, {
		fieldId: props.fieldId,
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
async function deleteGroup(displayRuleGroupGuid: string): Promise<void> {
	const emptyGroup =
		groupObject.value.conditions.length === 0 &&
		groupObject.value.groups.length === 0;

	let deleteGroup = emptyGroup;
	if (!emptyGroup) {
		// Confirm removal if group is not empty
		deleteGroup = await tConfirmDialogAsync(
			t('component.adminDisplayRuleGroup.confirm.title'),
			t('component.adminDisplayRuleGroup.confirm.text'),
			{
				text: t('component.adminDisplayRuleGroup.confirm.buttonText'),
				color: 'error',
			}
		);
	}
	if (deleteGroup) {
		store.commit(MutationType.RemoveGroupFromDisplayRuleGroup, {
			fieldId: props.fieldId,
			displayRuleGroupGuid,
			fieldProperty: 'displayRuleGroup',
		});
	}
}
</script>

<style scoped lang="scss">
.display-rule-group {
	position: relative;
	margin-left: 14px;
	padding: 10px 0;

	&__content {
		background-color: #3e3e3e0f;
		border-radius: $border-radius;
		padding: 10px;
	}
	&__top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.delete-button {
			margin: 0;
			.v-icon {
				margin-right: 6px;
			}
		}
	}

	.connection-line {
		height: $display-rule-line-thickness;
		width: 14px;
		background-color: $display-rule-line-color;
		position: absolute;
		left: -14px;
		top: 38px;
	}

	.conditions-wrap {
		padding-top: size(16);
		margin-left: 14px;
		border-left: solid $display-rule-line-thickness $display-rule-line-color;
	}
	.v-card-actions {
		padding-left: 28px !important;
		.connection-turn {
			left: 14px !important;
		}
	}
}
</style>
