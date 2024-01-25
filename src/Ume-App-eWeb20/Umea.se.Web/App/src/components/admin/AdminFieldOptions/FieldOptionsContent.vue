<template>
	<div class="field-options-content">
		<!-- Render tab content for field options -->
		<v-window :model-value="activeTab" :disabled="true">
			<v-window-item :value="1" class="field-options">
				<slot name="basic"></slot>
			</v-window-item>
			<v-window-item :value="2" class="field-options">
				<slot name="display"></slot>
			</v-window-item>
			<v-window-item :value="3" class="field-options">
				<slot name="data"></slot>
			</v-window-item>
			<v-window-item :value="4" class="field-options">
				<slot name="integration"></slot>
			</v-window-item>
		</v-window>
	</div>
</template>

<script setup lang="ts">
import { IRootState } from '@/models/IForm';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore<IRootState>();

const activeTab = computed(() => {
	return store.state.admin?.activeFieldOptionsTab ?? 1;
});
</script>

<style scoped lang="scss">
.field-options-content {
	.v-window-item {
		transition: none;
	}
}
</style>
