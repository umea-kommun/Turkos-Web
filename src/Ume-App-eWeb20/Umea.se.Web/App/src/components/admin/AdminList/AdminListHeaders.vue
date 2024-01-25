<template>
	<tr>
		<th v-for="header in headers" :key="header.title">
			<div
				class="admin-list-header"
				:class="{
					sortable: header.sortable !== false,
					sorted: sortBy[0].key === header.key,
					asc: sortBy[0].order === 'asc',
					desc: sortBy[0].order === 'desc',
					[header.align ?? '']: header.align,
				}"
				@click="onSortChange(header.key)"
			>
				{{ header.title }}
				<v-icon icon="arrow_upward" class="sort-icon" />
			</div>
		</th>
	</tr>
</template>

<script setup lang="ts">
import { ISortBy } from '@/models/IForm';
import { computed, PropType } from 'vue';


const props = defineProps({
	sortBy: {
		type: Object as PropType<ISortBy[]>,
		required: true,
	},
	headers: {
		type: Array as PropType<
			{
				title: string;
				key: string;
				align?: string;
				sortable?: boolean;
			}[]
		>,
		required: true,
	},
});

const emit = defineEmits(['update:sortBy']);

const sortBy = computed({
	get: () => props.sortBy,
	set: (val: ISortBy[]) => emit('update:sortBy', val),
});

function onSortChange(key: string): void {
	if (sortBy.value[0].key === key) {
		const order = sortBy.value[0].order === 'desc' ? 'asc' : 'desc';
		sortBy.value = [{ key, order }];
	} else {
		sortBy.value = [{ key, order: 'desc' }];
	}
}
</script>
<style scoped lang="scss">
.admin-list-header {
	display: inline-flex;
	align-items: center;
	font-size: size(14);
	color: $grey-darken-1;

	&.start {
		width: 100%;
	}

	.sort-icon {
		opacity: 0;
		transition: all 0.2s ease;
		margin-left: 6px;
	}
	&.sortable {
		cursor: pointer;
	}
	&.sortable:hover .sort-icon {
		opacity: 0.5;
	}
	&.sortable.sorted .sort-icon {
		opacity: 1;
	}
	&.sortable.sorted.asc .sort-icon {
		transform: rotate(180deg);
	}
}
</style>
