<template>
	<div>
		<div class="html-editor" @focusin.stop>
			<Editor
				class="editor"
				v-model="internalValue"
				:init="editorInit"
				@focus="setActiveInput"
			/>
		</div>
		<div class="v-messages theme--light">
			Sätt markören i fältet ovan för att ange HTML-formatterad text.
			<div :class="getCharlimitClass()" v-if="charlimit">
				{{ tinylen }} / {{ charlimit }}
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import Editor from '@tinymce/tinymce-vue'; // Import tinymce-vue plugin
/* Import TinyMCE */
import tinymce from 'tinymce'; // Import tinymce, required to use tinymce without cloud
/* Import plugins */
import 'tinymce/plugins/link'; // Import tinymce theme, required to use tinymce without cloud
import 'tinymce/plugins/lists'; // Import tinymce theme, required to use tinymce without cloud
import 'tinymce/plugins/advlist'; // Import tinymce theme, required to use tinymce without cloud
import 'tinymce/plugins/image'; // Import tinymce theme, required to use tinymce without cloud
/* Required TinyMCE components */
import 'tinymce/themes/silver'; // Import tinymce theme, required to use tinymce without cloud
import 'tinymce/models/dom'; // Import tinymce theme, required to use tinymce without cloud
/* Default icons are required. After that, import custom icons if applicable */
import 'tinymce/icons/default'; // Import tinymce theme, required to use tinymce without cloud
/* Import a skin (can be a custom skin instead of the default) */
import 'tinymce/skins/ui/oxide/skin.min.css'; // Import of tinymce skin, required to use tinymce without cloud
import { useAdminFileManager } from '@/components/admin/Composable/adminFileManager';
import { MutationType } from '@/models/Enums';
import { useStore } from 'vuex';

// Init TinyMce
tinymce.init({});
tinymce.EditorManager.execCommand('mceRemoveEditor', true, Editor);

const props = defineProps({
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
	modelValue: {
		type: String,
		required: true,
	},
	allowImages: {
		type: Boolean,
		default: false,
	},
	stepId: String,
	fieldId: String,
});
const emit = defineEmits(['update:modelValue']);
const tinylen = ref<number>(0);

const adminFileManager = useAdminFileManager();
const store = useStore();

const setActiveInput = (event: FocusEvent): void => {
	const textarea = event.target as HTMLTextAreaElement;
	store.commit(MutationType.SetActiveInput, textarea.id);
};

watchEffect(() => {
	const insertAtCursor = store.state.insertAtCursor;
	if (insertAtCursor) {
		tinymce.activeEditor?.execCommand(
			'mceInsertContent',
			false,
			insertAtCursor
		);
		store.commit(MutationType.CleartInsertAtCursor);
	}
});

const tinyPlugins = computed(() => {
	const plugins = ['link', 'lists'];
	if (props.allowImages) {
		plugins.push('image');
	}
	return plugins;
});

const editorInit = computed(() => {
	return {
		branding: false,
		menubar: false,
		plugins: tinyPlugins.value,
		width: props.width,
		height: props.height,
		theme: 'silver',
		modal: true,
		skin: false,
		content_css: false,
		content_style:
			'body { font-family: "Calibri", "Candara", "Segoe", "Segoe UI", "Optima", Arial, sans-serif; }',
		ui_container: '.modal', // bootstrap modal
		toolbar:
			// eslint-disable-next-line max-len
			'insertfile a11ycheck undo redo | styles | bold italic | image | alignleft aligncenter alignright alignjustify | bullist numlist | link | removes | removeformat',
		setup: (ed: any) => {
			ed.on('keydown', (args: any) => {
				tinylen.value = ed.getContent({ format: 'text' }).length;
				if (
					args.ctrlKey &&
					(args.key === 'x' || args.key === 'c' || args.key === 'v')
				) {
					return true;
				} else if (
					props.charlimit &&
					(tinylen.value === props.charlimit ||
						tinylen.value >= props.charlimit) &&
					args.keyCode !== 8 &&
					args.keyCode !== 46 &&
					args.keyCode !== 13
				) {
					return false;
				}
			})
				.on('keyup', (args: any) => {
					tinylen.value = ed.getContent({ format: 'text' }).length;
				})
				.on('init', (args: any) => {
					tinylen.value = ed.getContent({ format: 'text' }).length;
				});

			ed.editorUpload = undefined;
		},
		file_picker_types: 'image',
		file_picker_callback: (cb: any) => {
			const input = document.createElement('input');
			input.setAttribute('type', 'file');
			input.setAttribute('accept', 'image/*');

			input.addEventListener('change', async (e: Event) => {
				const target = e.target as HTMLInputElement;
				if (target?.files?.length) {
					const file = target.files[0];
					const blobUri = await adminFileManager.addFile(
						file,
						props.stepId ?? '-',
						props.fieldId ?? '-'
					);
					cb(blobUri, { title: file.name });
				}
			});

			input.click();
		},
		automatic_uploads: false,
		images_replace_blob_uris: false,
	};
});

const internalValue = computed({
	/**
	 * Get items from state
	 * @return {IItem[]} A list with items
	 */
	get: () => {
		return props.modelValue;
	},
	/**
	 * Set items in state
	 * @param {IItem} items - Items to set
	 */
	set: (value: string) => {
		emit('update:modelValue', value);
	},
});

function getCharlimitClass(): string {
	if (props.charlimit) {
		if (tinylen.value > props.charlimit) {
			return 'right-aligned error-text';
		} else {
			return 'right-aligned';
		}
	}
	return '';
}
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
	.html-editor {
		background: #f2f2f2 !important;
		border-top-right-radius: 4px;
		border-top-left-radius: 4px;
		border-bottom: #999 solid 2px;

		.mce-content-body {
			padding: 10px 10px 0;
			p:last-child {
				padding-bottom: 0;
				margin-bottom: 0;
			}
		}
	}
}
</style>
