<template>
	<div class="admin-banner">
		<h1 class="mt-2 mb-2">{{ $t('component.adminBanner.title') }}</h1>
		<p>
			{{ $t('component.adminBanner.description') }}
		</p>
		<app-loading-spinner
			v-if="isBusyLoadingFromServer"
			:isVisible="isBusyLoadingFromServer"
		></app-loading-spinner>
		<v-card v-else>
			<v-card-text>
				<admin-text-box
					id="bannerText"
					v-model="bannerText"
					:label="$t('component.adminBanner.title')"
					:textArea="true"
				/>
				<admin-switch
					id="bannerActive"
					:label="$t('component.adminBanner.active')"
					v-model="bannerActive"
				/>
			</v-card-text>
			<v-card-actions
				><div class="modified">
					<span v-if="bannerModified">{{
						$t('component.adminBanner.lastModified', [
							bannerModified,
						])
					}}</span>
				</div>
				<v-btn
					variant="flat"
					color="primary"
					@click="saveBanner"
					:loading="isBusySaving"
					:disabled="isBusySaving || !canSave"
					>{{ $t('component.adminBanner.save') }}</v-btn
				>
			</v-card-actions>
		</v-card>
	</div>
</template>

<script setup lang="ts">
import { IRootState } from '@/models/IForm';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useTConfirmDialog } from '@turkos/components';
import AdminTextBox from '@/components/field/admin/AdminTextBox.vue';
import AdminSwitch from '@/components/field/admin/AdminSwitch.vue';
import moment from 'moment';

const { t } = useI18n();
const store = useStore<IRootState>();
const { tConfirmDialogAsync } = useTConfirmDialog();

const isBusyLoadingFromServer = ref(true);
const isBusySaving = ref(false);

const bannerText = ref('');
const bannerActive = ref(false);

const banner = computed(() => store.state.banner);

const bannerModified = computed(() => {
	if (banner.value?.modified) {
		return moment.utc(banner.value.modified).local().format('LLLL');
	}
	return null;
});

const canSave = computed(() => {
	return (
		bannerText.value !== banner.value?.text ||
		bannerActive.value !== banner.value.active
	);
});
const saveBanner = async (): Promise<void> => {
	if (bannerActive.value && !banner.value?.active) {
		// If the user is trying to activate the banner, ask for confirmation
		const activeBanner = await tConfirmDialogAsync(
			t('component.adminBanner.confirm.title'),
			t('component.adminBanner.confirm.text')
		);
		if (!activeBanner) {
			// User canceled, abort save
			return;
		}
	}

	isBusySaving.value = true;
	if (banner.value) {
		// Update existing banner
		await store.dispatch('updateBanner', {
			banner: {
				id: banner.value.id,
				text: bannerText.value,
				active: bannerActive.value,
			},
		});
	} else {
		// Create a new banner
		await store.dispatch('createBanner', {
			banner: {
				text: bannerText.value,
				active: bannerActive.value,
			},
		});
	}
	isBusySaving.value = false;
};

onMounted(async () => {
	isBusyLoadingFromServer.value = true;
	await store.dispatch('getBannerList');
	if (banner.value) {
		bannerText.value = banner.value.text;
		bannerActive.value = banner.value.active;
	}
	isBusyLoadingFromServer.value = false;
});
</script>

<style scoped lang="scss">
.admin-banner {
	padding: 20px 30px;

	.modified {
		color: $grey-darken-1;
		margin-left: 6px;
	}

	.v-card {
		max-width: 600px;

		.v-card-actions {
			justify-content: space-between;
			.v-btn {
				border-radius: $border-radius;
				text-transform: none;
				letter-spacing: normal;
				padding: 0 16px;
			}
		}
	}
}
</style>
