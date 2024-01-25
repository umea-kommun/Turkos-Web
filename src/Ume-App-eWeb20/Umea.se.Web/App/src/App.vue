<template>
	<v-app id="app" :class="'route-' + routeName">
		<app-error />

		<!-- Render any confirm dialogs -->
		<t-confirm-dialog />

		<!-- App Header -->
		<app-header v-if="!adminView" :size="contentSize" />

		<!-- Sizes your content based upon application components -->
		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container
				fluid
				class="max-width pl-0 pr-0"
				:class="{ 'full-width': adminView }"
			>
				<!-- Render component per route -->
				<div class="route-view-container">
					<router-view />
				</div>
			</v-container>
		</v-main>

		<app-footer v-if="!adminView" :size="contentSize" />

		<!-- Display warning about automatic logout due to inactivity -->
		<!-- <auth-notification /> -->

		<!-- Tell the user that we have logged out -->
		<v-snackbar
			:model-value="
				$route.query.logoutReason === 'manual' ||
				$route.query.logoutReason === 'tokenerror'
			"
			location="top"
			color="info"
			multi-line
			role="alert"
			:timeout="getSnackbarTimeout()"
		>
			{{
				$t(
					$route.query.logoutReason === 'manual'
						? 'app.auth.loggedOutManual'
						: 'app.auth.loggedOutTokenError'
				)
			}}
		</v-snackbar>
	</v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '@/components/app/AppHeader.vue';
import AppFooter from '@/components/app/AppFooter.vue';
import AppError from '@/components/app/AppError.vue';
import { TConfirmDialog } from '@turkos/components';
import { AppContentSize } from './models/Enums';
import Config from './utils/Config';

const route = useRoute();

const routeName = computed(() => {
	return route.name?.toString() ?? '';
});
const adminView = computed(() => {
	return route.name?.toString()?.indexOf('Admin') === 0;
});
const contentSize = computed(() => {
	return route.meta.contentSize as AppContentSize;
});

function getSnackbarTimeout(): number {
	return parseInt(Config.VUE_APP_SNACKBAR_TIMEOUT, 10);
}
</script>

<style scoped lang="scss">
.application {
	.app-content {
		padding-top: 0px;
	}

	.error-debug-msg {
		color: pink;
	}
}

.route-view-container {
	// prevents footer from jumping up and down when navigating between routes
	-webkit-box-flex: 1;
	-ms-flex: 1 1 auto;
	flex: 1 1 auto;
	max-width: 100%;
	position: relative;
}

:deep(.v-snackbar__wrapper) {
	position: absolute;
}
</style>
