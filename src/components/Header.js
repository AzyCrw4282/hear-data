/* global DEBUG, APP_TITLE */
/*
* Header component fragment for source and the buttons 
* Credit: Azky & Library code
*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { createConfirmation } from 'react-confirm';

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import HelpIcon from '@material-ui/icons/Help';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import SpreadsheetIcon from '@material-ui/icons/List';

import IconButton from '../extensions/IconButton';
import ConfirmModal from './ConfirmationModal';
import hearDataIcon from '../images/hearDataIcon.jpg';

const confirm = createConfirmation(ConfirmModal);

const styles = theme => ({
	title: {
		flex: 2,
		display: 'flex',
		marginLeft: '30%',
		alignItems: 'center',
		'& > *': {
			display: 'flex'
		}
	},
	titleText: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		cursor: 'pointer',
        color: 'white'
	},
	logo: {
		height: 50,
        width: 50,
		marginRight: theme.spacing.unit
	},
	'@media (max-height: 445px)': {
		title: {
			height: 36,
			minHeight: 36
		},
		logo: {
			height: 32
		}
	},
	'@media (max-width: 445px), (max-height: 445px)': {
		titleText: {
			fontSize: '1rem'
		}
	}
});

const Def = class AppHeader extends React.Component {
	static propTypes = {
        selectData: PropTypes.func.isRequired,
		dataSource: PropTypes.object,
		onDataToggle: PropTypes.func,
		classes: PropTypes.object.isRequired,
		resetClick: PropTypes.func.isRequired,
		applyConfig: PropTypes.func.isRequired
	}

    //handles reset action
	processResetAction = evt => {
		evt.stopPropagation();
		const confirmation = <React.Fragment>Please confirm you want to reset this data?</React.Fragment>;
		confirm({ confirmation, options: {
			no: 'No',
			yes: 'Yes'
		}}).then(() => {
			this.props.resetState();
			return null;
		}).catch(() => {
			if (DEBUG) {
				console.log('Not clearing. Everything is fine.');
			}
		});
	}

    //handles help action
	helpButton = () => {
		this.props.setConfig({
			showTour: true
		});
	}

	render() {
		const {
			classes,
			dataSource,
			selectDataSource,
			onDataToggle
		} = this.props;

		const logo = <img src={hearDataIcon} alt="Data Icon logo" className={classes.logo}/>;

		return <React.Fragment>

			<Typography className={classes.title} variant="h5" color="white" component="h1">
				{APP_WEBSITE_URL ? <a href={APP_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
					{logo}
				</a> : logo}
				{dataSource ?
					<React.Fragment>
						<span className={classes.titleText} onClick={selectDataSource}>
							{dataSource.metadata.title}
						</span>
						<IconButton label="Select Data Source" color="inherit" onClick={selectDataSource} data-tour-id="upload-data-source">
							<EditIcon/>
						</IconButton>
					</React.Fragment> : null
				}
			</Typography>
			<IconButton onClick={onDataToggle} label="Click to view data" color="inherit" data-tour-id="data-display-panel">
					<SpreadsheetIcon/>
				</IconButton>				
				<span className={classes.resetButton}>
				<IconButton label="Reset Project" color="inherit" onClick={this.processResetAction} data-tour-id="reset-project-button">
					<DeleteIcon/>
				</IconButton>
				</span>
				<IconButton onClick={this.helpButton} label="Click to see help" color="inherit" data-tour-id="show-tour-button">
					<HelpIcon/>
				</IconButton>
		
		</React.Fragment>;
	}
};


const AppHeader = withStyles(styles)(
	connect(['dataSource'], actions)(Def)
);

export default AppHeader;
/*
withStyles and connect are Higher Order Components (HOC), which is a pattern where you 
take a component and you add features to it by wrapping a new component around it 
(usually to add props to it, or hook into lifecycle methods). Def is the original 
component. AppHeader is the same component as Def, enhanced by the two HOCs.
HOCs were a popular pattern, but they've largely been replaced by Hooks in 
modern react components
More-> https://medium.com/@tevthuku/all-hail-unistore-9b2f79184592

Takes an array of states that are to be accessed by the Component(if they are many), 
if its just one you can pass a single string and actions as a second param, 
->The App components receives the actions and the state as props..
*/