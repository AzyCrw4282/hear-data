import React from 'react';

import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';

const globalTheme = createMuiTheme({
	typography: {
		useNextVariants: true
	},
	palette: {
		type: 'light',
		// background: {
		// 	default: '#212121',
		// 	paper: '#323232'
		// },
		primary: {
			light: '#6ff9ff',
			main: '#26daa8', // Cyan[400]
			dark: '#0095a8',
			contrastText: '#000'
		},
		secondary: {
			light: '#ffad42',
			main: '#7B7D7D', 
			dark: '#bb4d00',
			contrastText: '#000'
		},
		// divider: '#e0f7fa',
		error: yellow
	}
});

const Def = ({children}) =>
	<MuiThemeProvider theme={globalTheme}>{children}</MuiThemeProvider>;

Def.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node
	])
};
const Theme = Def;
export default Theme;