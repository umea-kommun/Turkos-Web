<template>
	<div class="admin-add-field">
		<v-divider />

		<v-menu
			class="admin-add-field-menu"
			transition="slide-x-transition"
			:location-strategy="setMenuLocation as any"
		>
			<template v-slot:activator="{ props }">
				<!-- Add button -->
				<v-btn
					v-bind="props"
					icon
					flat
					rounded="pill"
					:size="24"
					:title="$t('component.adminForm.fields.title')"
					@click="hideFieldOptions"
				>
					<v-icon :size="16" icon="add" />
				</v-btn>
			</template>
			<div class="menu-triangle">◀</div>

			<!-- Add menu content -->
			<v-card>
				<div class="card-top">
					<v-card-title>
						{{ $t('component.adminForm.fields.title') }}
					</v-card-title>
					<v-btn icon :size="32" flat>
						<v-icon icon="close" />
					</v-btn>
				</div>

				<div class="field-container">
					<v-btn
						flat
						class="field"
						v-for="fieldType in availableFieldTypes"
						:key="fieldType"
						:title="
							$t(
								`component.${fieldTypeCamel(
									fieldType
								)}.description`
							)
						"
						@click="emit('onAddField', fieldType, fieldIndex)"
						:disabled="
							disableTable && fieldType === FormFieldType.Table
						"
					>
						<div class="icon-wrap">
							<v-icon :icon="getFieldIcon(fieldType)" />
						</div>
						<div class="field-name">
							{{
								$t(
									`component.${fieldTypeCamel(
										fieldType
									)}.title`
								)
							}}
						</div>
					</v-btn>
				</div>
			</v-card>
		</v-menu>
	</div>
</template>

<script setup lang="ts">
import { FormFieldIcon, FormFieldType, MutationType } from '@/models/Enums';
import { IRootState } from '@/models/IForm';
import { ref, Ref, WritableComputedRef } from 'vue';
import { useStore } from 'vuex';

defineProps({
	fieldIndex: {
		type: Number,
		required: true,
	},
	disableTable: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['onAddField']);

const store = useStore<IRootState>();

function hideFieldOptions(): void {
	store.commit(MutationType.UpdateAdminState, {
		prop: 'activeFieldId',
		value: null,
	});
}
const availableFieldTypes = ref<FormFieldType[]>([]);
availableFieldTypes.value = Object.values(FormFieldType).filter(
	(fieldType) => fieldType !== FormFieldType.Integration
);

// FormFieldType --> formFieldType
function fieldTypeCamel(fieldType: FormFieldType): string {
	return fieldType.charAt(0).toLowerCase() + fieldType.slice(1);
}

function getFieldIcon(fieldType: FormFieldType): FormFieldIcon {
	return FormFieldIcon[fieldType];
}

/**
 * Set location of add menu
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const setMenuLocation = (
	data: {
		target: Ref<HTMLButtonElement>;
		contentEl: Ref<HTMLDivElement>;
	},
	props: unknown,
	contentStyles: WritableComputedRef<Record<string, string>>
) => {
	const updateLocation = (): void => {
		const offset = 50;
		const activator = data.target.value;
		const menu = data.contentEl.value;

		const activatorBounds = activator.getBoundingClientRect();
		let x =
			activatorBounds.left +
			activator.clientWidth +
			8 +
			(activator.parentElement?.clientWidth ?? 1) / 2;

		let y = activatorBounds.top - offset;
		let triangleY = offset;

		// Reposition if outside window
		const menuBounds = menu.getBoundingClientRect();
		if (x + menuBounds.width > window.innerWidth - offset) {
			const diff = x + menuBounds.width - window.innerWidth + offset;

			x -= diff;
		}
		if (y + menuBounds.height > window.innerHeight - offset) {
			const diff = Math.min(
				y + menuBounds.height - window.innerHeight + offset,
				menuBounds.height - offset * 2
			);
			y -= diff;
			triangleY = diff + offset;
		}

		// Set position for triangle
		const triangle = menu.firstElementChild as HTMLDivElement;
		if (triangle) {
			triangle.style.top =
				triangleY - 1 + activatorBounds.height / 2 + 'px';
		}

		Object.assign(contentStyles.value, {
			position: 'fixed',
			top: y + 'px',
			left: x + 'px',
		});
	};
	setTimeout(updateLocation); // Menu needs to render before we can access its location
	return {
		updateLocation,
	};
};
</script>

<style scoped lang="scss">
.admin-add-field {
	position: relative;
	min-height: 30px;
	text-align: center;

	.v-divider {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		color: $grey-lighten-5;
		margin-top: -1px;
		border-top: dashed 1px;
		opacity: 1;
	}

	.v-btn {
		border: 2px solid #c9c9c9;
		color: $grey-darken-1;
	}
}
.admin-add-field-menu {
	z-index: 80 !important;
	.v-card {
		min-width: 360px;
		position: relative;
		border-radius: $border-radius !important;
		box-shadow: 0px 3px 6px #00000029 !important;
		color: $black;

		.card-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20px;
			border-bottom: solid 1px $grey-lighten-2;

			.v-btn {
				margin: 0;
				color: $black;
			}
			.v-card-title {
				padding: 0;
				font-weight: bold;
			}
		}
	}
	.menu-triangle {
		position: absolute;
		top: 50%;
		margin-top: -18px;
		left: -17px;
		color: #fff;
		text-shadow: -4px 1px 4px #00000012;
		font-size: 24px;
		z-index: 100;
	}

	.field-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		.field {
			&:disabled {
				:deep(.v-btn__overlay) {
					opacity: 0.2 !important;
				}
			}
			height: 100px;
			max-width: 140px;
			margin: 0;
			min-height: auto;
			min-width: auto;
			text-transform: none;
			letter-spacing: normal;

			color: $black;
			font-size: size(16);

			border-bottom: solid 1px $grey-lighten-2;
			border-right: solid 1px $grey-lighten-2;
			border-radius: 0;

			:deep(.v-btn__content) {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}

			.field-name {
				overflow: hidden;
				text-decoration: none;
				text-overflow: ellipsis;
				white-space: nowrap;
				max-width: 120px;
				min-height: 16px;
			}
			.icon-wrap {
				margin-bottom: 10px;
				padding: 10px;
				background-color: $grey-lighten-2;
				border-radius: $border-radius;
				color: $grey-darken-3;
				font-size: 14px;
			}
		}
	}
}
</style>
