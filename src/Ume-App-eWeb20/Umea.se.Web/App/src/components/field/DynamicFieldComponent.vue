<template>
	<component
		ref="component"
		:is="componentName"
		:field="field"
		:mode="mode"
		:class="classList"
		:validationScope="validationScope"
		:validationId="validationId"
		@updatedValue="updatedValue"
		@updatedOptions="updatedOptions"
		:admin-preview="adminPreview"
	></component>
</template>

<script lang="ts">
import { IFormField } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import FieldRadioButton from '@/components/field/FieldRadioButton.vue';
import FieldDatePicker from '@/components/field/FieldDatePicker.vue';
import FieldCheckBox from '@/components/field/FieldCheckBox.vue';
import FieldFileUpload from '@/components/field/FieldFileUpload.vue';
import FieldTextArea from '@/components/field/FieldTextArea.vue';
import FieldTextBox from '@/components/field/FieldTextBox.vue';
import { PropType, computed, defineComponent, Component } from 'vue';
import FieldSection from '@/components/field/FieldSection.vue';
import FieldSelectList from '@/components/field/FieldSelectList.vue';
// import FieldTable from '@/components/field/FieldTable.vue';
import FieldPersonalNumber from '@/components/field/FieldPersonalNumber.vue';
import FieldTextSearchBox from '@/components/field/FieldTextSearchBox.vue';
import FieldHiddenTextBox from '@/components/field/FieldHiddenTextBox.vue';
import FieldSelectSearchList from '@/components/field/FieldSelectSearchList.vue';
import FieldNumeric from '@/components/field/FieldNumeric.vue';

/**
 * Load a field component dynamically
 * @prop {IFormField} field - Field data, implementing IFormField
 * @prop {string} mode - PRINT|VIEW|EDIT|ADMIN
 */
export default defineComponent({
	props: {
		field: Object as PropType<IFormField>,
		mode: String,
		classList: {
			type: String,
			default: '',
		},
		validationScope: {
			type: String,
			default: '',
		},
		validationId: {
			type: String,
			default: '',
		},
		adminPreview: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['updatedValue', 'updatedOptions'],
	components: {
		FieldTextBox,
		FieldDatePicker,
		FieldRadioButton,
		FieldCheckBox,
		FieldFileUpload,
		FieldTextArea,
		// FieldTable,
		FieldSection,
		FieldSelectList,
		FieldPersonalNumber,
		FieldTextSearchBox,
		FieldHiddenTextBox,
		FieldSelectSearchList,
		FieldNumeric,
	},
	setup(props, { emit }) {
		const componentName = computed<string | null | Component>(() => {
			if (props.field) {
				return Helper.getComponentName(props.field.type);
			} else {
				return null;
			}
		});

		function updatedValue($event: any): void {
			emit('updatedValue', $event);
		}
		function updatedOptions($event: any): void {
			emit('updatedOptions', $event);
		}

		return { componentName, updatedValue, updatedOptions };
	},
});
</script>

<style scoped lang="scss">
.base-image img {
	max-width: 100%;
}
</style>
