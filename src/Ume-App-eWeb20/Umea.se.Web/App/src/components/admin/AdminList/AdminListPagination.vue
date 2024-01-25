<template>
	<div class="admin-list-pagination">
		<div class="group">
			{{ $t('component.adminListForms.table.pagination.show') }}
			<v-select
				density="compact"
				v-model="itemsPerPage"
				:items="itemsPerPageOptions"
				variant="underlined"
				color="primary"
			/>
			{{ $t('component.adminListForms.table.pagination.rowsperpage') }}
		</div>
		<div class="group">
			{{ (page - 1) * itemsPerPage + 1 }} -
			{{
				itemsPerPage === -1
					? numberOfItems
					: Math.min(page * itemsPerPage, numberOfItems)
			}}
			{{ $t('component.adminListForms.table.pagination.labelof') }}
			{{ numberOfItems }}
		</div>
		<div class="group">
			<v-btn variant="plain" icon @click="page--" :disabled="page <= 1"
				><v-icon icon="chevron_left"
			/></v-btn>
			<v-btn
				variant="plain"
				icon
				@click="page++"
				:disabled="
					itemsPerPage === -1 || page * itemsPerPage >= numberOfItems
				"
				><v-icon icon="chevron_right"
			/></v-btn>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
	itemsPerPage: {
		type: Number,
		required: true,
	},
	page: {
		type: Number,
		required: true,
	},
	numberOfItems: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits(['update:itemsPerPage', 'update:page']);

const itemsPerPage = computed({
	get: () => props.itemsPerPage,
	set: (val: number) => emit('update:itemsPerPage', val),
});

const page = computed({
	get: () => props.page,
	set: (val: number) => emit('update:page', val),
});

const itemsPerPageOptions = [
	{
		title: '5',
		value: 5,
	},
	{
		title: '10',
		value: 10,
	},
	{
		title: '25',
		value: 25,
	},
	{
		title: '50',
		value: 50,
	},
	{
		title: '100',
		value: 100,
	},
	{
		title: t('component.adminListForms.table.pagination.All'),
		value: -1,
	},
];
</script>

<style scoped lang="scss">
.admin-list-pagination {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	color: $black;
	.group {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 30px;
	}
	:deep(.v-btn--disabled) {
		opacity: 0.2 !important;
	}

	:deep(.v-select.v-input) {
		display: flex;
		flex: initial;
		margin: 0px 6px;
		.v-field__input {
			padding: 0;
		}
		.v-input__details {
			display: none;
		}
		.v-field__append-inner{
			padding-top: 4px;
		}
		.v-select__selection {
			padding: 4px !important;
		}
	}
}
</style>
