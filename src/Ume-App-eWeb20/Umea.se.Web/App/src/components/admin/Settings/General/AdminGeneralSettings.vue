<template>
	<!-- EService -->
	<div v-if="!infoPage" class="admin-general-settings">
		<h1>
			{{ $t('component.adminFormProperties.generalPropertiesTitle') }}
		</h1>
		<admin-properties />
		<admin-user-requirements v-if="!linkExternal" />
		<admin-misc-properties />
	</div>

	<!-- Info Page -->
	<div v-else class="admin-general-settings">
		<h1>
			{{ $t('component.adminFormProperties.infoPagePropertiesTitle') }}
		</h1>
		<admin-properties />
	</div>
</template>

<script setup lang="ts">
import AdminProperties from '@/components/admin/Settings/General/AdminProperties.vue';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AdminMiscProperties from './AdminMiscProperties.vue';
import AdminUserRequirements from './AdminUserRequirements.vue';

defineProps({
	infoPage: {
		type: Boolean,
		default: false,
	},
	linkExternal: {
		type: Boolean,
		default: false,
	},
});

const route = useRoute();

onMounted(() => {
	if (route.hash) {
		// If there is a hash in the url, try to focus that element
		const element = document.getElementById(route.hash.substring(1));
		if (element) {
			element.focus();
		}
	}
});
</script>

<style scoped lang="scss">
.admin-general-settings {
	h1 {
		color: $black;
	}
	:deep(.card-wrap) {
		margin-top: 20px;

		h2 {
			color: $black;
			margin-bottom: 10px;
			font-size: size(20);
		}

		.v-card {
			padding: 16px;
			border-radius: $border-radius;
			margin-bottom: 40px;

			.v-progress-linear__indeterminate {
				// Color of progress bar
				background-color: $primary;
			}
		}
	}
}
</style>
