<template>
	<div>
		<v-row>
			<v-col>
				<admin-text-box
					id="wifi-title"
					name="wifi-title"
					v-model="title"
					:label="
						$t(
							'component.adminIntegrationUserWifiConnections.field.title'
						)
					"
					:help-text="
						$t(
							'component.adminIntegrationUserWifiConnections.field.titleHelpText'
						)
					"
					rules="required"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script setup lang="ts">
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import { AvailableIntegration } from '@/models/Enums';
import { IFormIntegration, IFormIntegrationOption } from '@/models/IForm';
import { computed, PropType, onMounted } from 'vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<IFormIntegration>,
		required: true,
	},
});

const emit = defineEmits(['update:modelValue']);

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

onMounted(async () => {
	if (
		getOption('datasourcename')?.value !==
		AvailableIntegration.UserWifiConnections
	) {
		setOption('datasourcename', AvailableIntegration.UserWifiConnections);
	}
});
</script>
