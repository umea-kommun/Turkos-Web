<template>
	<div>
		<v-row>
			<v-col>
				<admin-text-box
					id="navet-title"
					name="navet-title"
					v-model="title"
					:label="
						$t(
							'component.adminIntegrationNavetFardtjanst.field.title'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationNavetFardtjanst.field.titleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-select-list
					id="navet-navetMatterType"
					name="navet-navetMatterType"
					v-model="navetMatterType"
					:items="matterTypes"
					:label="
						$t(
							'component.adminIntegrationNavetFardtjanst.field.matterType'
						)
					"
					:standalone="false"
					rules="required"
				/>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<admin-select-list
					id="navetFields"
					v-model="navetFields"
					:items="formFields"
					:label="
						$t(
							'component.adminIntegrationNavetFardtjanst.field.exportedFields'
						)
					"
					chips
					multiple
					:error-messages="
						navetFieldWithSameName
							? [
									$t(
										'component.adminIntegrationNavetFardtjanst.field.exportedFieldsDuplicate',
										{ fieldName: navetFieldWithSameName }
									),
							  ]
							: undefined
					"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import {
	IFormIntegration,
	IFormIntegrationOption,
	IRootState,
} from '@/models/IForm';
import { computed, PropType, onMounted } from 'vue';
import { useStore } from 'vuex';
import { MatterType } from './IIntegrationNavet';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
	isNew: {
		type: Boolean,
		default: false,
	},
	activeTab: Number,
});

const emit = defineEmits(['update:modelValue']);

const store = useStore<IRootState>();
const { t } = useI18n();

const integration = computed({
	get: () => props.modelValue,
	set: (newValue: IFormIntegration) => {
		emit('update:modelValue', newValue);
	},
});

const getOption = (key: string): IFormIntegrationOption | undefined =>
	integration.value.options.find((option) => option.key === key);

const setOption = (key: string, value: string): void => {
	const option = getOption(key);
	if (option) {
		option.value = value;
	} else {
		integration.value.options.push({ key, value });
	}
};

const title = computed({
	get: () => getOption('title')?.value ?? '',
	set: (newValue: string) => setOption('title', newValue),
});

const matterTypes = computed(() => {
	return [
		{
			title: t(
				'component.adminIntegrationNavetFardtjanst.matterType.ftj'
			),
			value: MatterType.FTJ,
		},
		{
			title: t(
				'component.adminIntegrationNavetFardtjanst.matterType.rftj'
			),
			value: MatterType.RFTJ,
		},
	];
});

const navetMatterType = computed({
	get: () => {
		return getOption('navetMatterType')?.value ?? '';
	},
	set: (newValue: string) => {
		setOption('navetMatterType', newValue);
	},
});

const formFields = computed(() => {
	const form = store.state.form;
	const fields: { title: string; value: string }[] = [];
	form?.attributes.steps.forEach((step) => {
		step.fields.forEach((field) => {
			fields.push({ title: field.title, value: field.guid });
		});
	});
	return fields;
});

const navetFields = computed({
	get: () => {
		return (getOption('navetFields')?.value ?? '')
			.split(',')
			.filter((val) => !!val); // Convert string to an array and remove empty values
	},
	set: (newValue: string[]) => {
		setOption('navetFields', newValue.join(','));
	},
});

const navetFieldWithSameName = computed(() => {
	const fieldNames = navetFields.value.map((fieldGuid) => {
		const field = formFields.value.find((f) => f.value === fieldGuid);
		return field?.title ?? '';
	});
	const duplicates = fieldNames.filter(
		(item, index) => fieldNames.indexOf(item) !== index
	);
	if (duplicates?.length) {
		return duplicates[0];
	}
	return false;
});

onMounted(() => {
	if (props.isNew) {
		// Set default options for new integration
		const defaultOptions: IFormIntegrationOption[] = [
			{ key: 'title', value: '' },
			{ key: 'navetMatterType', value: '' },
			{ key: 'navetFields', value: '' },
		];

		integration.value = { ...integration.value, options: defaultOptions };
	}
});

const isValid = computed(() => !navetFieldWithSameName.value);
defineExpose({
	isValid,
});
</script>
