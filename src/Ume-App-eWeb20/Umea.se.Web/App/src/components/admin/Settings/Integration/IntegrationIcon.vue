<template>
	<v-avatar :class="classes" :size="size">
		<v-icon v-if="integrationIcon" :icon="integrationIcon" :size="size" />
		<img v-if="integrationImage" :src="integrationImage" />
		<img
			v-if="integrationLocalImage"
			:src="integrationLocalImage"
			class="assets-img"
		/>
	</v-avatar>
</template>

<script setup lang="ts">
import { computed, inject, PropType } from 'vue';
import { IIntegrationObject } from '@/plugins/integrations';
import { AvailableIntegration } from '@/models/Enums';

const props = defineProps({
	integrationType: String as PropType<AvailableIntegration>,
	size: {
		type: Number,
		default: 24,
	},
	classes: String,
});

const registeredIntegrationComponents = inject(
	'registeredIntegrationComponents'
) as IIntegrationObject[];

const integrationIcon = computed(() => {
	const iconName =
		registeredIntegrationComponents.find(
			(integration) =>
				integration.integrationType === props.integrationType
		)?.icon ?? '';
	if (iconName.indexOf('http') > -1 || iconName.includes('assets')) {
		return '';
	}
	return iconName;
});
const integrationImage = computed(() => {
	const imageUrl =
		registeredIntegrationComponents.find(
			(integration) =>
				integration.integrationType === props.integrationType
		)?.icon ?? '';
	if (imageUrl.indexOf('http') === 0) {
		return imageUrl;
	}
	return '';
});
const integrationLocalImage = computed(() => {
	const imageUrl =
		registeredIntegrationComponents.find(
			(integration) =>
				integration.integrationType === props.integrationType
		)?.icon ?? '';
	if (imageUrl.includes('assets') && !imageUrl.includes('http')) {
		return imageUrl;
	}
	return '';
});
</script>

<style scoped lang="scss">
.v-avatar {
	border-radius: 0%;
	.assets-img {
		padding: 2px;
	}
}
</style>
