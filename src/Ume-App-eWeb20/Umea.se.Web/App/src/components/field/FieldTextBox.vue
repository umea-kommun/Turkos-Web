<template>
	<div class="field-text-box" :class="fieldModeClass(mode)">
		<!-- ADMIN -->
		<div v-if="mode === 'ADMIN'">
			<field-options-content>
				<template v-slot:basic>
					<admin-single-field-options
						@updated-value="(a) => emit('updatedValue', a)"
						:field="props.field"
						:show-read-only="true"
						:show-use-as-contact-field="true"
					/>
				</template>

				<template v-slot:display>
					<display-options :field="props.field" />
				</template>

				<template v-slot:data>
					<admin-data-options :field="props.field" />
				</template>

				<template v-slot:integration>
					<admin-integration-options :field="props.field" />
				</template>
			</field-options-content>
		</div>

		<!-- EDIT -->
		<Field
			v-if="mode === 'EDIT'"
			:name="getValidationId"
			:label="title"
			v-model="value"
			v-slot="{ field, errors, meta }"
			:keepValue="true"
			:rules="adminPreview ? '' : validationRules"
			:standalone="adminPreview"
		>
			<base-form-field
				:id="'label' + id"
				:label="title"
				:label-for="getValidationId"
				:isRequired="isRequired"
				:errorDisplay="!!errors.length"
				:admin-preview-label="
					adminPreview &&
					(isPersonalNumber
						? $t('component.fieldPersonalNumber.newField')
						: $t('component.fieldTextBox.newField'))
				"
			>
				<ume-text-field
					ref="textField"
					v-bind="field"
					autocomplete="off"
					:id="getValidationId"
					:readonly="readOnly"
					@blur="keyLeave"
					:success="!readOnly && isSuccess(meta)"
					:required="isRequired"
					density="compact"
					:error="!!errors.length"
					:aria-labelledby="'label' + id"
					:aria-readonly="readOnly"
					:aria-describedby="
						!!errors.length ? 'error-' + getValidationId : null
					"
					:append-inner-icon="readOnly ? 'lock' : undefined"
					:inputmode="keyboardType"
				/>
				<HelpText
					:helpText="helpText"
					:errors="errors"
					:getValidationId="getValidationId"
					:fieldValid="meta.valid"
				>
				</HelpText>
			</base-form-field>
		</Field>

		<!-- VIEW -->
		<div v-if="mode === 'VIEW'">
			<form-field-preview
				:title="title"
				:value="value"
				:id="id"
			></form-field-preview>
		</div>

		<!-- PRINT -->
		<div v-if="mode === 'PRINT'">
			<PrintTextBox :title="title" :helpText="helpText"></PrintTextBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import FieldOptionsContent from '@/components/admin/AdminFieldOptions/FieldOptionsContent.vue';
import AdminSingleFieldOptions from '@/components/admin/AdminFieldOptions/AdminSingleFieldOptions.vue';
import DisplayOptions from '@/components/admin/AdminFieldOptions/DisplayOptions.vue';
import AdminDataOptions from '../admin/AdminFieldOptions/AdminDataOptions.vue';
import AdminIntegrationOptions from '../admin/AdminFieldOptions/AdminIntegrationOptions.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import { Field } from 'vee-validate';
import {
	ComponentPublicInstance,
	computed,
	inject,
	onMounted,
	PropType,
	ref,
	toRef,
} from 'vue';
import { FormMode, MutationType } from '@/models/Enums';
import { IRootState, ISingleValueField } from '@/models/IForm';
import { useSingleValueField } from './composable/SingleValueField';
import { useFieldValidation } from './composable/FieldValidation';
import HelpText from './helpAndError/HelpAndErrorText.vue';
import {
	checkIfFieldHasChild,
	getNewValueFromObject,
	whichFieldAreMyParent,
	whichFieldsAreMyChildren,
} from '@/store/utils';
import DataSourceApplier from '@/plugins/dataService/DataSourceApplier';
import { useStore } from 'vuex';
import { fieldModeClass } from '@/components/field/composable/FieldUtils';

// Define props
const props = defineProps({
	mode: {
		type: String as PropType<FormMode>,
		default: 'EDIT',
	},
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
	validationScope: {
		type: String,
		default: '',
	},
	validationId: {
		type: String,
		default: '',
	},
	isPersonalNumber: {
		type: Boolean,
		default: false,
	},
	adminPreview: {
		type: Boolean,
		default: false,
	},
});

const store = useStore<IRootState>();

// To use emit we have to define what the component emits
const emit = defineEmits(['updatedValue']);

// Use our composable singleValueField, we pass props and the emit function
const { id, value, helpText, title, fieldOptions } = useSingleValueField({
	mode: props.mode,
	field: toRef(props, 'field'),
	emit,
});

// Use our composable fieldValidation
const { getValidationId, validationRules, isSuccess, isRequired, readOnly } =
	useFieldValidation({
		validationId: props.validationId,
		validationScope: props.validationScope,
		isPersonalNumber: props.isPersonalNumber,
		fieldOptions,
		id,
	});

// Keyboard type for mobile users
const keyboardType = computed(() => {
	if (!validationRules.value?.length) {
		return 'text';
	}
	for (const ruleName of validationRules.value.split('|')) {
		switch (ruleName) {
			case 'numeric':
			case 'zipCode':
			case 'validPersNumber':
				return 'numeric';
			case 'email':
				return 'email';
		}
	}
	return 'text';
});

function newChar(
	lower: string[],
	upper: string[],
	nums: string[],
	specials: string[]
): string {
	let set;
	if (specials.length > 0) {
		set = [lower, upper, nums, specials];
	} else {
		set = [lower, upper, nums];
	}
	const pick = set[Math.floor(Math.random() * set.length)];
	return pick[Math.floor(Math.random() * pick.length)];
}

function automaticGeneratePassword(): string {
	const length = fieldOptions.value.generatedPassword?.passwordLength || 16;
	const arg =
		fieldOptions.value.generatedPassword?.selectedPasswordSpecialCharacters
			.value === 'true' // This should be a boolean, but we receive a string
			? '~!@#$%^&*()_+-=[]{}|;:.,?><'
			: '';
	const lowercase = [
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'j',
		'k',
		'm',
		'n',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z',
	];
	const uppercase = lowercase.join('').toUpperCase().split('');
	const specialChars = arg.split('').filter((item) => item.trim().length);
	const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
	let password = '';
	let lastChar;
	for (let i = 0; i < length; i++) {
		const char = newChar(lowercase, uppercase, numbers, specialChars);
		if (char !== lastChar) {
			password = password + char;
			lastChar = char;
		} else {
			i--;
		}
	}
	return password;
}

function saveUpdatedFormField(
	fieldId: string,
	newValue: any,
	fieldProperty: string
): void {
	store.commit(MutationType.UpdateFormField, {
		fieldId,
		newValue,
		fieldProperty,
	});
}

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

async function keyLeave(): Promise<void> {
	if (
		store.state.form &&
		checkIfFieldHasChild(props.field.guid, store.state.form) &&
		props.field.value !== ''
	) {
		const dataSourceAppliera = dataSourceApplier;
		const dataSourceSpecifications =
			await dataSourceAppliera.fetchDataSourceSpecifications();
		const myChildren = whichFieldsAreMyChildren(
			props.field.guid,
			store.state.form,
			dataSourceSpecifications
		);
		let myParent: any;
		if (
			(props.field?.fieldOptions as any)?.dataSource?.options
				?.dependsOnDataSourceSearchParameter
		) {
			myParent = whichFieldAreMyParent(
				(props.field.fieldOptions as any)?.dataSource.options
					.dependsOnDataSourceSearchParameters[0],
				store.state.form
			);
		}
		const searchParameter = myChildren[0].searchParameter;
		const dataSourceData =
			await dataSourceAppliera.fetchDataSourcesUsedInForm(
				store.state.form,
				props.field.value,
				searchParameter
			);
		if (dataSourceData.size > 0) {
			myChildren.forEach((field: any) => {
				const data = dataSourceData.get(field.dataSourceName);
				const newValueFromObject = getNewValueFromObject(data, field);
				saveUpdatedFormField(
					field.id,
					newValueFromObject.newValue,
					newValueFromObject.fieldProperty
				);
			});
		}
	}
}

const textField = ref(null);
onMounted(() => {
	if (props.mode === 'EDIT') {
		if (
			fieldOptions.value.generatedPassword &&
			fieldOptions.value.generatedPassword.autoGeneratedPassword &&
			fieldOptions.value.generatedPassword
				.selectedPasswordSpecialCharacters &&
			value.value === ''
		) {
			value.value = automaticGeneratePassword();
		}
	}
	if (value.value.length && textField.value) {
		// If field has an initial value we need to forceUpdate, otherwise the value wont be visible until focus event
		// Hopefully this will be fixed in a later Vuetify version
		(textField.value as ComponentPublicInstance).$forceUpdate();
	}
});
</script>

<style scoped lang="scss">
.field-text-box {
	&.edit-mode,
	&.print-mode,
	&.view-mode {
		:deep(.v-input--is-readonly .v-text-field__details) {
			padding-bottom: 8px;
		}

		:deep(.v-input--is-readonly input) {
			cursor: default;
			opacity: 0.8;
		}

		:deep(.v-input--is-readonly .v-input__slot) {
			background: #f9f9f9;
		}

		:deep(.v-input__details) {
			padding: 0;
			margin-bottom: 4px;
		}

		:deep(.v-input .v-field__field) {
			--v-input-padding-top: 5px;
		}
		:deep(.v-input__details) {
			display: none;
		}
	}
}
</style>
