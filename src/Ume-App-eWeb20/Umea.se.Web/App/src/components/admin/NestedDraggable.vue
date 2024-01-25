<template>
	<div>
		<draggable
			id="first"
			:list="fieldsCopy"
			class="list-group"
			item-key="guid"
			handle=".handleOrginal"
			@change="onChangeField"
			:component-data="{
				tag: 'ul',
				type: 'transition-group',
				name: !false ? 'flip-list' : null,
			}"
			v-bind="dragOptions"
			@start="drag = true"
			@end="drag = false"
		>
			<template #header>
				<admin-add-field
					@onAddField="onAddField"
					:fieldIndex="0"
					@contextmenu.prevent.stop="
						emit('showContextMenu', { $event, index: 0 })
					"
				/>
			</template>
			<template #item="{ element, index }">
				<div
					class="list-group-item"
					@contextmenu.prevent.stop="
						emit('showContextMenu', { $event, index: index + 1 })
					"
				>
					<div>
						<admin-field
							@onAddField="onAddField"
							:field="element"
							:fieldIndex="index + 1"
							@onChangeField="onChangeField"
							@onChangeTableField="onChangeTableField"
							@contextmenu.prevent.stop="
								emit('showContextMenu', {
									$event,
									field: element,
									index: index + 1,
								})
							"
							@showContextMenu="
								(params) => emit('showContextMenu', params)
							"
						/>
						<admin-add-field
							@onAddField="onAddField"
							:fieldIndex="index + 1"
						/>
					</div>
				</div>
			</template>
		</draggable>
	</div>
</template>

<script lang="ts">
import { IFormField } from '@/models/IForm';
import { FormFieldType } from '@/models/Enums';
import { PropType, defineComponent, computed, ref } from 'vue';
import AdminField from '@/components/admin/AdminField.vue';
import AdminAddField from '@/components/admin/AdminAddField.vue';
import draggable from 'vuedraggable';

export default defineComponent({
	props: {
		fields: {
			type: Object as PropType<IFormField[]>,
			required: true,
		},
		tableGuid: {
			type: String,
			required: false,
		},
	},
	emits: ['onAddField', 'onChangeField', 'showContextMenu'],
	components: { draggable, AdminField, AdminAddField },
	setup(props, { emit }) {
		const drag = ref(false);

		const fieldsCopy = computed(() => [...props.fields]);

		const dragOptions = computed(() => {
			return {
				animation: 200,
				group: 'description',
				disabled: false,
				ghostClass: 'ghost',
			};
		});

		function onAddField(
			fieldType: FormFieldType,
			rootFieldIndex: number,
			tableGuid: string | undefined
		): void {
			emit('onAddField', fieldType, rootFieldIndex, tableGuid);
		}
		function onChangeField($event: any): void {
			if ($event !== undefined) {
				emit(
					'onChangeField',
					$event.added,
					$event.moved,
					props.tableGuid
				);
			}
		}
		function onChangeTableField(
			added: any,
			moved: any,
			tableGuid: string
		): void {
			emit('onChangeField', added, moved, tableGuid);
		}
		function isTableType(type: FormFieldType | string): boolean {
			return type === FormFieldType.Table;
		}

		return {
			onAddField,
			onChangeField,
			onChangeTableField,
			isTableType,
			emit,
			fieldsCopy,
			drag,
			dragOptions,
		};
	},
	name: 'nested-draggable',
});
</script>
<style scoped>
.list-group-item {
	padding-top: 10px;
}
.list-group {
	min-height: 180px;
}
.flip-list-move {
	transition: transform 0.5s;
}
.no-move {
	transition: transform 0s;
}
.ghost {
	opacity: 0.5;
}
</style>
