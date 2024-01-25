<template>
	<div class="admin-data-search-options">
		<div v-if="isDataSourceSpecsSearchLoaded" class="options">
			<admin-select-list
				id="dataSourceSearchSpecs"
				v-model="dataSourceSearchConnectedToField"
				:items="getDataSourceSpecsSearch"
				item-value="dataSourceName"
				:label="$t('app.admin.adminDataOptions.dataSource.dataSource')"
				:help-text="
					$t(
						'app.admin.adminDataOptions.dataSource.descriptionSearch'
					)
				"
			/>

			<div v-if="resultToInPutDataSourceNames.length" class="grey-box">
				<h5>
					{{
						$t(
							'app.admin.adminDataOptions.dataSource.resultToInput'
						)
					}}
				</h5>
				<ul>
					<li
						v-for="input in resultToInPutDataSourceNames"
						:key="input"
					>
						{{ input }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import AdminSelectList from '@/components/field/admin/AdminSelectList.vue';
import { IFormField, IRootStateDataSearchService } from '@/models/IForm';
import {
	IDataSourceSpecification,
	IDataSourceConnector,
} from '@/plugins/dataService/models';
import { computed, PropType, inject } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
	field: {
		type: Object as PropType<IFormField>,
		required: true,
	},
	singleEntity: {
		type: Boolean,
		required: true,
	},
});

const store = useStore<IRootStateDataSearchService>();

const dataSourceConnector = inject(
	'$dataSourceConnector'
) as IDataSourceConnector;

const isDataSourceSpecsSearchLoaded = computed(() =>
	store.state.dataServiceSearchPlugin.dataSourceSpecsSearch ? true : false
);

const dataSourceSearchConnectedToField = computed({
	get: () => {
		const dataSource = dataSourceConnector.getSearchConnection(props.field);
		return dataSource ? dataSource.dataSourceName : '';
	},
	set: (dataSourceName: string) => {
		if (!dataSourceName) {
			dataSourceConnector.removeSearchConnection(props.field);
		} else {
			dataSourceConnector.setSearchConnection(props.field, {
				dataSourceName,
				options: {},
			});
		}
	},
});

const getDataSourceSpecsSearch = computed(() => {
	let sources = (
		store.state.dataServiceSearchPlugin.dataSourceSpecsSearch || []
	).map((spec: IDataSourceSpecification) => {
		let label = '';
		let disabled = false;
		if (props.singleEntity) {
			if (!spec.singleEntity) {
				label = '(ej applicerbar)';
				disabled = true;
			}
		} else {
			if (spec.singleEntity) {
				label = '(ej applicerbar)';
				disabled = true;
			}
		}
		return {
			title: spec.description + ' ' + label,
			dataSourceName: spec.dataSourceName,
			disabled,
		};
	});

	// sort by name
	sources = sources.sort((a, b) => (a.title > b.title ? 1 : -1));

	return [{ title: '-- Ingen koppling --', dataSourceName: '' }].concat(
		sources
	);
});

const resultToInPutDataSourceNames = computed(() => {
	let descriptions: string[] = [];
	if (
		dataSourceSearchConnectedToField.value &&
		store.state.dataServiceSearchPlugin.dataSourceSpecsSearch
	) {
		const dataSourceSpecsSearch =
			store.state.dataServiceSearchPlugin.dataSourceSpecsSearch.find(
				(d) =>
					d.dataSourceName === dataSourceSearchConnectedToField.value
			);
		dataSourceSpecsSearch?.resultToInPutDataSourceNames?.forEach(
			(resultToInPutDataSourceName) => {
				const dataSourceSpecs =
					store.state.dataServicePlugin.dataSourceSpecs?.find(
						(d) => d.dataSourceName === resultToInPutDataSourceName
					);

				if (dataSourceSpecs) {
					descriptions.push(dataSourceSpecs.description);
				}
			}
		);
		return descriptions;
	}
	return descriptions;
});
</script>

<style scoped lang="scss">
.admin-data-search-options {
	.options {
		border-left: solid $primary 2px;
		padding: 0 24px;
		margin: 10px 0;
		margin-top: 18px;
		margin-bottom: 30px;

		h3 {
			font-size: size(18);
			color: $black;
		}
		p {
			margin-bottom: 2px;
		}

		.grey-box {
			margin-top: 20px;
			padding: 10px;
			background-color: $grey-lighten-2;
			border-radius: $border-radius;
			color: $black;

			li {
				margin-left: 20px;
			}
		}
	}
}
</style>
