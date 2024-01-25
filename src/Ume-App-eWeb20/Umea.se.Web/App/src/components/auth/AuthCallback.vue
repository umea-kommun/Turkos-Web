<template>
	<div class="auth-callback">
		<app-loading-spinner :isVisible="true"></app-loading-spinner>
	</div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import { useStore } from 'vuex';
import { IRootState } from '@/models/IForm';
import IAuthManager from '@/plugins/auth/IAuthManager';
import { useRouter } from 'vue-router';

/**
 * Route redirecting user back to where she came from before logging in via the SSO-service
 */

const auth = inject('$auth') as IAuthManager;
const store = useStore<IRootState>();
const router = useRouter();

function paramsToObject(entries: URLSearchParams): { [key: string]: string } {
	const result: { [key: string]: string } = {};
	for (const [key, value] of entries) {
		result[key] = value;
	}
	return result;
}

onMounted(async () => {
	if (store.state.user.isAuthenticated) {
		window.location.href = '/';
	} else {
		const urlParams = new URLSearchParams(window.location.search);
		const state = urlParams.get('state') || '';
		const code = urlParams.get('code') || '';
		try {
			const afterLoginPath = await auth.handleLoginCallbackAsync(
				state,
				code
			);

			let afterLoginPathQueryParams = {};
			if (afterLoginPath.indexOf('?') > -1) {
				afterLoginPathQueryParams = paramsToObject(
					new URLSearchParams(
						afterLoginPath.substring(afterLoginPath.indexOf('?'))
					)
				);
			}
			router.push({
				path: afterLoginPath,
				query: { ...afterLoginPathQueryParams },
			});
		} catch (err) {
			console.error(err);
			// user has to manually logout at this point, or this
			// needs to be taken care of in "handleLoginCallbackAsync"
			router.push('/?logoutReason=tokenerror');
		}
	}
});
</script>
