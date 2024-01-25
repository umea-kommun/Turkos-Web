<template>
	<v-card class="item-field-options theme--light" flat>
		<v-card-title>
			<h4>
				{{ $t('component.adminItemListManager.rubrik') }}
			</h4>
		</v-card-title>
		<v-card-subtitle></v-card-subtitle>
		<v-card-text>
			<draggable
				v-model="itemsCopy"
				item-key="name"
				class="list-group"
				ghost-class="ghost"
				handle=".drag-handle"
				@start="dragging = true"
				@end="dragging = false"
				:animation="200"
			>
				<template #item="{ element }">
					<div class="list-group-item">
						<v-row class="row-align-items">
							<div class="drag-handle padding-right">
								<v-icon icon="drag_indicator"></v-icon>
							</div>
							<div class="v-text-field-flex">
								<!-- Title -->
								<v-text-field
									class="input-item"
									:label="
										$t(
											'component.adminItemListManager.title'
										)
									"
									density="comfortable"
									color="primary"
									v-model="element.title"
									@input="
										updateTitle(
											element,
											$event.target.value
										)
									"
								></v-text-field>
							</div>
							<div>
								<v-checkbox
									ml-2
									:model-value="element.isChecked"
									:label="
										$t(
											'component.adminItemListManager.checked'
										)
									"
									:key="element.id"
									type="checkbox"
									color="primary"
									hide-details
									persistent-hint
									@update:model-value="
										(val: boolean) =>
											onItemChangeCheck(element, val)
									"
								></v-checkbox>
							</div>
							<div v-if="!TypeSelectList">
								<v-btn
									flat
									icon
									@click.prevent="
										showExtraInformation(
											element.id,
											element.helptext
										)
									"
								>
									<v-icon icon="info_outline"></v-icon>
								</v-btn>
							</div>
							<div>
								<!-- Delete -->
								<v-btn flat icon @click="removeItem(element)">
									<v-icon
										class="delete-icon"
										icon="delete_outline"
									></v-icon>
								</v-btn>
							</div>
						</v-row>
					</div>
				</template>
			</draggable>
		</v-card-text>
		<v-card-actions>
			<v-btn variant="text" flat color="primary" @click="addItem()">
				<v-icon icon="add" left class="padding-right"></v-icon>
				{{ $t('component.adminItemListManager.addItem') }}
			</v-btn>
		</v-card-actions>
		<base-html-editor-modal
			ref="dialog"
			:title="$t('component.adminItemListManager.helpText')"
			@updated-value="updateHelpText"
		/>
	</v-card>
</template>

<script setup lang="ts">
import { FormFieldType } from '@/models/Enums';
import { IItem, IFormField } from '@/models/IForm';
import { PropType, computed, ref } from 'vue';
import { Helper } from '@/utils/helper';
import draggable from 'vuedraggable';
import BaseHtmlEditorModal from '@/components/base/BaseHtmlEditorModal.vue';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
	type: {
		type: String as PropType<FormFieldType>,
		required: false,
	},
	allowMultipleChecked: {
		type: Boolean,
		required: true,
		default: false,
	},
	items: {
		type: Object as PropType<IItem[]>,
		required: true,
	},
});
const emit = defineEmits(['updatedOptions']);

const dragging = ref<boolean>(false);
const TypeSelectList: boolean = props.type === FormFieldType.SelectList;

const dialog = ref<InstanceType<typeof BaseHtmlEditorModal> | null>(null);
function showExtraInformation(id: string, value: string): void {
	dialog.value?.open(id, value);
}

function emitUpdatedOptions(itemList: IItem[]): void {
	emit('updatedOptions', {
		newOptions: {
			...props.field.fieldOptions,
			items: itemList,
		},
	});
}

const itemsCopy = computed({
	/**
	 * Get items from state
	 * @return {IItem[]} A list with items
	 */
	get: () => {
		return Helper.deepCopy(props.items || []) as IItem[];
	},
	/**
	 * Set items in state
	 * @param {IItem} items - Items to set
	 */
	set: (items: IItem[]) => {
		emitUpdatedOptions(items);
	},
});

/**
 * Add new item to list
 */
function addItem(): void {
	const newItemList = Helper.deepCopy<IItem[]>(itemsCopy.value);
	const newItem = {
		title: '',
		isChecked: false,
		id: Helper.generateUuid(),
		helptext: '',
	} as IItem;
	newItemList.push(newItem);
	emitUpdatedOptions(newItemList);

	setTimeout(() => {
		// We need to wait for the dom to update
		const inputs = document.querySelectorAll(
			'.item-field-options .input-item input'
		);
		if (inputs?.length) {
			// Focus new item
			(inputs[inputs.length - 1] as HTMLInputElement).focus();
		}
	});
}

/**
 * Remove item from list
 */
function removeItem(itemToRemove: IItem): void {
	const newItemList = itemsCopy.value.filter(
		(item) => item.id !== itemToRemove.id
	);
	emitUpdatedOptions(newItemList);
}

function updateHelpText({ id, htmlText }: any): void {
	itemsCopy.value.forEach((element) => {
		if (element.id === id) {
			element.helptext = htmlText;
		}
	});
	emitUpdatedOptions(itemsCopy.value);
}

/**
 * Update item in list
 */
function updateTitle(item: IItem, newTitle: string): void {
	// We must update isChecked since this isn't done when binding.
	// Parameter checkedItems is only a list of checkbox's that are checked but boolean isChecked is not changed
	itemsCopy.value.forEach((element) => {
		if (element.id === item.id) {
			element.title = newTitle;
		}
	});
	emitUpdatedOptions(itemsCopy.value);
}

/**
 * Check/uncheck item in list
 */
function onItemChangeCheck(checkedItem: IItem, newValue: boolean): void {
	// Check if more than one item can be changed
	if (!props.allowMultipleChecked) {
		itemsCopy.value.forEach((item) => (item.isChecked = false));
	}
	// Set checked item
	itemsCopy.value.forEach((item) => {
		if (item.id === checkedItem.id) {
			item.isChecked = newValue;
		}
	});
	emitUpdatedOptions(itemsCopy.value);
}
</script>

<style scoped lang="scss">
.item-field-options {
	border-radius: 0;
	border-left-color: $primary;
	border-left-width: 2px;
	padding-left: 22px !important;
	padding-right: 5px;

	.v-icon {
		color: $grey-darken-1;

		&.delete-icon {
			color: $error;
		}
	}
	.drag-handle {
		cursor: move;
	}
	.padding-right {
		padding-right: 10px;
	}
	.v-card-title {
		padding-left: 0px;
	}
	.v-card-text {
		padding: 0;
	}
	.v-card-actions {
		padding-top: 0px;
		margin-left: -15px;

		.v-btn {
			padding: 0 16px;
		}
	}
	.row-align-items {
		flex-direction: row;
		align-items: center !important;
		margin: 10px 0;
	}
	.v-text-field-flex {
		flex: 1;
		padding-right: 10px;
	}
	:deep(.v-field__field) {
		padding-left: 8px;
	}
	:deep(.v-input__details) {
		display: none !important;
	}
}
</style>
