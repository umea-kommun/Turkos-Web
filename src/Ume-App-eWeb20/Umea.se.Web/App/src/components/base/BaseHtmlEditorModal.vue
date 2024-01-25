<template>
	<div>
		<v-dialog
			transition="slide-y-transition"
			v-model="doOpen"
			max-width="1000px"
			:persistent="true"
			:no-click-animation="true"
			@click:outside="closeDialog"
			class="base-html-editor-modal"
		>
			<v-card role="alert">
				<v-card-title v-if="title" class="grey lighten-2" primary-title>
					<strong>
						{{ title }}
					</strong>
				</v-card-title>
				<v-card-text>
					<base-html-editor
						v-model="internalValue"
						:width="props.width"
						:height="props.height"
						:charlimit="props.charlimit"
						:allowImages="props.allowImages"
						:stepId="props.stepId"
						:fieldId="props.fieldId"
					/>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						flat
						@click="doOpen = false"
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
import BaseHtmlEditor from '@/components/base/BaseHtmlEditor.vue';

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	width: {
		type: String,
		required: false,
		default: '100%',
	},
	height: {
		type: String,
		required: false,
	},
	charlimit: {
		type: Number,
		required: false,
	},
	/** Showing html dialog. */
	showDialog: {
		type: Boolean,
		default: false,
	},
	yesButtonLabel: {
		type: String,
		default: '',
	},
	allowImages: {
		type: Boolean,
		default: false,
	},
	stepId: String,
	fieldId: String,
});
const emit = defineEmits(['dialogClose', 'updatedValue']);
const htmlText = ref<string>('');
const id = ref<string>('');

const internalValue = computed({
	/**
	 * Get items from state
	 * @return {IItem[]} A list with items
	 */
	get: () => {
		return htmlText.value;
	},
	/**
	 * Set items in state
	 * @param {IItem} items - Items to set
	 */
	set: (value: string) => {
		htmlText.value = value;
		emit('updatedValue', {
			id: id.value,
			htmlText: value,
		});
	},
});

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
function open(idGuid: string, value: string): Promise<boolean> {
	doOpen.value = true;
	htmlText.value = value;
	id.value = idGuid;
	return new Promise((resolve) => {
		const unwatch = watch(doOpen, () => {
			if (!doOpen.value) {
				unwatch();
				resolve(true);
			}
		});
	});
}

function closeDialog(event: any): void {
	if (event.target.closest('.v-overlay__scrim') != null) {
		doOpen.value = false;
	}
}

// Expose the open function so it can be used outside of the component
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.base-html-editor-modal {
	.v-label {
		font-size: 13px;
		padding: 10px;
		display: inline-block;
	}
	.right-aligned {
		float: right;
	}
	.error-text {
		color: red;
	}
}
</style>
