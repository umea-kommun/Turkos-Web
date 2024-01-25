<template>
	<div>
		<label
			class="field-title text-subtitle-1 font-weight-bold"
			:for="value ? 'field-' + id : undefined"
			>{{ title }}</label
		>
		<div>
			<v-layout row>
				<v-col cols="11" class="pa-0">
					<div v-if="value" class="field-value" :id="'field-' + id">
						{{ value }}
					</div>
					<slot v-else></slot>
				</v-col>
				<v-col cols="1" class="pa-0">
					<v-icon class="lock-icon" icon="lock" />
				</v-col>
			</v-layout>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps({
	title: String,
	value: String,
	id: String,
});
</script>

<style scoped lang="scss">
.lock-icon {
	color: #000 !important;
}
</style>
