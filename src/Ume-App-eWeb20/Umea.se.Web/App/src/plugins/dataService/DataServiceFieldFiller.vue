<template>
	<span></span>
</template>

<script setup lang="ts">
import { Helper } from '@/utils/helper';
import { IFormField, IRootState } from '@/models/IForm';
import { MutationType } from '@/models/Enums';
import { inject, PropType, watch } from 'vue';
import { useStore } from 'vuex';
import DataSourceApplier from './DataSourceApplier';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
	value: {
		type: String,
		required: true,
	},
});

const store = useStore<IRootState>();

const dataSourceApplier = inject('$dataSourceApplier') as DataSourceApplier;

watch(
	() => props.value,
	async () => {
		if (props.value.toString() !== '0') {
			const dataSourceAppliera = dataSourceApplier;
			const formCopy = Helper.deepCopy(store.state.form);

			if (!formCopy) {
				return;
			}
			if (
				props.field.fieldOptions &&
				props.field.fieldOptions.tableGuid
			) {
				let fieldTable: any;
				formCopy.attributes.steps.forEach((step) => {
					if (
						!fieldTable ||
						(fieldTable && fieldTable.length === 0)
					) {
						fieldTable = step.fields.filter(
							(f) => f.guid === props.field.fieldOptions.tableGuid
						);
					}
				});
				await dataSourceAppliera.applyDataToTableRow(
					fieldTable[0],
					formCopy
				);
				store.commit(MutationType.GetForm, formCopy);
			} else {
				if (!store.state.form) {
					return;
				}
				const dataSourceData =
					await dataSourceAppliera.fetchDataSourcesUsedInForm(
						store.state.form,
						props.value,
						''
					);
				if (dataSourceData.size > 0) {
					dataSourceAppliera.applyDataSources(
						dataSourceData,
						formCopy
					);
					store.commit(MutationType.GetForm, formCopy);
				}
			}
		}
	}
);
</script>

<style scoped lang="scss"></style>
