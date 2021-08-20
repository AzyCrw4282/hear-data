/*
* Sets the theme for the Interface
* Credit: Library code
*/
import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const globalTheme = createMuiTheme({

	palette: {
		type: 'light',
		primary: {
			light: '#6ff9ff',
			main: '#26daa8', // Cyan[400]
			dark: '#0095a8',
			contrastText: '#000'
		},
		secondary: {
			light: '#6ff9ff',
			main: '#7B7D7D', 
			dark: '#6ff9ff',
			contrastText: '#000'
		},
		error: orange
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