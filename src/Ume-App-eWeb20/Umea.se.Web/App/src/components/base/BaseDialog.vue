<template>
	<div class="base-dialog">
		<v-dialog
			transition="slide-y-transition"
			v-model="doOpen"
			max-width="540px"
		>
			<v-card role="alert">
				<v-card-title v-if="title" class="grey lighten-2" primary-title>
					<strong>
						<v-icon class="title-icon" v-if="titleIcon">{{
							titleIcon
						}}</v-icon>
						{{ title }}
					</strong>
				</v-card-title>
				<v-card-text>
					<div v-if="text" v-html="text"></div>
					<slot v-else></slot>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						flat
						@click="closeDialog"
						:title="$t('app.nav.close')"
						:showDialog="showDialog"
						>{{ yesButtonLabel || $t('app.nav.close') }}</v-btn
					>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
	/** Text message for confirmation dialog. */
	text: {
		type: String,
		default: '',
	},
	/** Showing confirmation dialog. */
	showDialog: {
		type: Boolean,
		default: false,
	},
	yesButtonLabel: {
		type: String,
		default: '',
	},
	titleIcon: {
		type: String,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['dialogClose']);

/** Controls the dialog, can be set programatically by calling component.open() or via showDialog prop */
const isDialogOpen = ref<boolean>(false);

const doOpen = computed({
	get: () => {
		return isDialogOpen.value || props.showDialog;
	},
	set: (isOpen: boolean) => {
		isDialogOpen.value = isOpen;
		if (!isOpen) {
			emit('dialogClose');
		}
	},
});

/**
 * Opens up the confirm dialog, will resolve to true when closed
 */
function open(): Promise<boolean> {
	doOpen.value = true;
	return new Promise((resolve) => {
		const unwatch = watch(doOpen, () => {
			if (!doOpen.value) {
				unwatch();
				resolve(true);
			}
		});
	});
}

function closeDialog(): void {
	doOpen.value = false;
}

// Expose the open function so it can be used outside of the component
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.title-icon {
	vertical-align: -7px;
	margin-right: 3px;
}
</style>
