/* global APP_TITLE */
//fixed and tested
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import hearDataIcon from './../images/hearDataIcon.jpg'

const styles = theme => ({

    dialog: {
        minWidth: '30%',
        minHeight: '30%',
        maxWidth: '80%',
        maxHeight: '80%',

        display: 'flex',
        flexDirection: 'row',
        '& > *': {
            height: '40%',
            width: '40%'
        }
    },

    dialogContent : {
        display: 'flex',
        flexDirection: 'column'
    },

    title: {
		flex: 2,
		'& > *': {
			margin: `{theme.spacing.unit * 3}px 0`
		}
	},

	logo: {
		margin: theme.spacing.unit * 3,
		alignSelf: 'Right',
		textAlign: 'center',
        margin: '20px',
		'& img': {
			width: 250,
			maxWidth: '90%',
			maxHeight: '90%'
		}
	},

	dialogActions: {
		justifyContent: 'center',
        textAlign: 'center',
        marginTop: '25px'
	}
});


const Def = class WelcomeModal extends React.Component {
    //props
	static propTypes = {
		classes: PropTypes.object.isRequired,
		open: PropTypes.bool.isRequired,
		onClose: PropTypes.func.isRequired
	}

    //default states
    static defaultProps = {
        open: true
    }

	state = {
	}

    render(){
        const {
            classes,
            open,
            onClose
        }= this.props

		return <Dialog
			id="welModal"
			open={open}
			keepMounted={false}
			disableBackdropClick={true}
			hideBackdrop={true}
            disableEscapeKeyDown = {true}
			classes={{
				paper: classes.dialog
			}}
		>
			<DialogContent className={classes.dialogContent}>
				<div className={classes.title}>
					<Typography id="modalTitle" color="black" variant="h6">Welcome to {APP_TITLE}</Typography>
					<Typography variant="subtitle1">Tool to covert data into sound</Typography>
				</div>
				<DialogActions className={classes.dialogActions}>
					<Button onClick={onClose} variant="contained" color="primary">Enter Site - {APP_TITLE}</Button>
				</DialogActions>
			</DialogContent>
			<div className={classes.logo}>
				<img src={hearDataIcon} margin-top = {'100px' } alt={`Image cannot be displayed. ${APP_TITLE} logo`} />
			</div>
		</Dialog>;


    }
};

const WelcomeDialog = withStyles(styles)(Def);
export default WelcomeDialog;