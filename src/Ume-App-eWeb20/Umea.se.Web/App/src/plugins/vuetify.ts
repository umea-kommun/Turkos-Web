// Styles
import 'vuetify/styles';
import 'material-design-icons-iconfont/dist/material-design-icons.css'; // Ensure you are using css-loader
import { aliases, md } from 'vuetify/iconsets/md';

// Vuetify
import { createVuetify } from 'vuetify';

export default createVuetify({
	icons: {
		defaultSet: 'md',
		aliases,
		sets: {
			md,
		},
	},
	theme: {
		defaultTheme: 'umeaTheme',
		themes: {
			umeaTheme: {
				colors: {
					background: '#f2f2f2',
					primary: '#006e1e', // Björk, darker version, Umeåkommun
					secondary: '#00a01e', // Björk, lighter version, Umeå kommun
					accent: '#e4b1c2', // Rosa, Umeå kommun
					error: '#EF5350', // Red
					info: '#424242', // Grey-darken-3 from Material design
					success: '#006e1e', // Green
					warning: '#FFC107', // Orange
				},
			},
		},
	},
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
