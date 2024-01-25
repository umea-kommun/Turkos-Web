<template>
	<v-snackbar v-if="isError" v-model="isError" location="top" multi-line>
		<div class="userMessageWrap">
			<v-icon size="default" icon="error" />
			<p>{{ errorMessage }}</p>
			<v-btn variant="text" color="white" @click="isError = false">
				{{ $t('app.nav.close') }}
			</v-btn>
		</div>

		<!-- <code class="error-debug-msg">
				{{ error }}
			</code> -->
	</v-snackbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import { IRootState } from '@/models/IForm';
import { useI18n } from 'vue-i18n';
import { MutationType } from '@/models/Enums';

const store = useStore<IRootState>();
const { t } = useI18n();

const isError = computed({
	get: () => !!store.state.error,
	set: (value) => {
		if (!value && store.state.error) {
			store.commit(MutationType.SetError, { err: null });
		}
	},
});
const errorMessage = computed(
	() => store.state.errorUserMessage ?? t('app.error.general')
);
</script>

<style scoped lang="scss">
.v-snackbar {
	.userMessageWrap {
		display: flex;
		align-items: center;
		flex: 1;

		p {
			flex: 1;
			margin: 0 10px;
		}
	}
	.error-debug-msg {
		margin-top: 10px;
		display: block;
		background-color: $black;
		padding: 10px;
		border-radius: 4px;
		color: pink;
	}
}
</style>
