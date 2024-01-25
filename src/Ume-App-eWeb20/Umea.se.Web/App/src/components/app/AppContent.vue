<template>
	<!--Tillgänglighetsjustering: Comments out <v-main> since one already has been declared. There should only be 
		one main-tag on the page.-->
	<!-- <v-main class="app-content"> -->
	<v-container class="pt-0">
		<!-- Flexbox layout that puts our stuff in the center (class name important for printing) -->
		<v-layout class="content-layout">
			<v-col :class="sizeClasses" class="content-flex pa-0 mb-1">
				<div flat id="main-content" class="overflow-visible">
					<v-card-text class="pa-0">
						<!-- Spinner while loading content  -->
						<app-loading-spinner
							:isVisible="isLoading"
						></app-loading-spinner>

						<!-- Error message if content can not be loaded-->
						<v-container
							v-if="errorMessage"
							style="background: #fff"
						>
							<v-alert
								:value="errorMessage"
								type="warning"
								variant="outlined"
								>{{ errorMessage }}
							</v-alert>
						</v-container>

						<!-- Render slot content -->
						<template v-if="!isLoading && !errorMessage">
							<slot></slot>
						</template>
					</v-card-text>
				</div>
			</v-col>
		</v-layout>
	</v-container>
	<!-- </v-main> -->
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AppContentSize } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTitle } from '@vueuse/core';

const props = defineProps({
	size: {
		type: String as PropType<AppContentSize>,
		default: AppContentSize.Default,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
	errorMessage: {
		type: String,
		default: '',
	},
	pageTitle: {
		type: String,
		default: '',
	},
});

const { t } = useI18n();

// Page title
const fullPageTitle = computed(() => {
	if (!props.pageTitle) {
		return t('app.title').toString() + ' - ' + t('app.title').toString();
	}
	return props.pageTitle + ' - ' + t('app.title').toString();
});
// Automatically updates page title when fullPageTitle changes
useTitle(fullPageTitle);

const sizeClasses = computed(() => {
	return Helper.getSizeClasses(props.size);
});
</script>

<style scoped lang="scss">
.content-layout {
	justify-content: center;

	#main-content {
		background: none;
	}
}
</style>
