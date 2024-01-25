<template>
	<v-icon v-if="shouldBeDisplayed" :color="color" :size="size"
		>access_alarm</v-icon
	>
</template>

<script setup lang="ts">
import { IForm } from '@/models/IForm';
import { DateScheduleUtils } from '@/store/utils';
import { computed, PropType } from 'vue';

const props = defineProps({
	form: {
		type: Object as PropType<IForm>,
		required: true,
	},
	size: String,
});

const shouldBeDisplayed = computed(() => {
	return DateScheduleUtils.isScheduled(props.form);
});

const color = computed(() => {
	return DateScheduleUtils.isScheduledToBeVisibleNow(props.form)
		? 'green'
		: 'grey';
});
</script>

<style scoped lang="scss"></style>
