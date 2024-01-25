<template>
	<v-layout>
		<v-col class="slot-wrap pa-0">
			<slot></slot>
		</v-col>
		<v-col class="pa-0 pl-1">
			<v-btn
				color="primary"
				variant="outlined"
				role="menuitem"
				:loading="loadingData"
				@click="getData()"
			>
				<span>
					{{ buttonText }}
				</span>
			</v-btn>
		</v-col>
	</v-layout>
</template>

<script setup lang="ts">
import { Helper } from '@/utils/helper';
import { IForm, IRootState, ISingleValueField } from '@/models/IForm';
import { MutationType } from '@/models/Enums';
import { inject, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';
import DataSourceSearchApplier from './DataSourceSearchApplier';
import DataSourceApplier from './DataSourceApplier';

const props = defineProps({
	field: {
		type: Object as PropType<ISingleValueField>,
		required: true,
	},
	buttonText: String,
	findValue: String,
	value: {
		type: String,
		default: '',
	},
});

const store = useStore<IRootState>();

const loadingData = ref<boolean>(false);

const dataSourceSearchApplier = inject(
	'$dataSourceSearchApplier'
) as DataSourceSearchApplier;

async function getData(): Promise<void> {
	if (props.value !== '') {
		loadingData.value = true;
		const formCopy = Helper.deepCopy(store.state.form) as IForm;
		const dataSourceSearchAppliera = dataSourceSearchApplier;
		const dataSourceName = (props.field.fieldOptions as any)
			.searchDataSource.dataSourceName;
		const dataSourceData =
			await dataSourceSearchAppliera.fetchDataSourcesUsedInForm(
				dataSourceName,
				props.value
			);
		if (dataSourceData.size > 0) {
			dataSourceSearchAppliera.applyDataSources(
				dataSourceData,
				formCopy,
				props.field.guid
			);
			store.commit(MutationType.GetForm, formCopy);
		}
		loadingData.value = false;
	}
}

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

async function onDataFind(): Promise<void> {
	if (props.findValue?.length && store.state.form) {
		const dataSourceAppliera = dataSourceApplier;
		const dataSourceData =
			await dataSourceAppliera.fetchDataSourcesUsedInForm(
				store.state.form,
				props.findValue,
				''
			);
		if (dataSourceData.size > 0) {
			const formCopy = Helper.deepCopy(store.state.form);
			dataSourceAppliera.applyDataSources(dataSourceData, formCopy);
			store.commit(MutationType.GetForm, formCopy);
		}
	}
}

watch(() => props.findValue, onDataFind);
</script>

<style scoped lang="scss">
.slot-wrap {
	flex: auto;
}
.datasource-info {
	border: #ccc solid 1px;
	border-radius: 3px;
	padding: 8px;
	margin-bottom: 8px;
	pre {
		background: #222;
		color: lightyellow;
		padding: 3px;
		margin-top: 4px;
		max-height: 200px;
		overflow-y: auto;
	}
}
</style>
