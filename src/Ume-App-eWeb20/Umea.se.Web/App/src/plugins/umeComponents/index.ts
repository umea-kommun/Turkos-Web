import UmeTextField from './UmeTextField/UmeTextField.vue';
import UmeNumericField from './UmeNumericField/UmeNumericField.vue';
import './style.scss';

export default {
	install(app: any): void {
		/**
		 * This plugin will later be extracted into a separate library that can be used
		 * in other projects.
		 * But to ease development its kept here for now
		 */

		// Register components
		app.component('UmeTextField', UmeTextField);
		app.component('UmeNumericField', UmeNumericField);
	},
};
