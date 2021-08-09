import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';

const globalTheme = createMuiTheme({

	palette: {
		type: 'light',
		primary: {
            main: '#26c6da', // Cyan[400]
			dark: '#0095a8',
			light: '#6ff9ff',
			contrastText: '#000'
		},
		secondary: {
            main: '#f57c00', // Orange[700]
			dark: '#bb4d00',
			light: '#ffad42',
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