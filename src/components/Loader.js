import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 2
	},
	warning: {
		color : 'red',
		textAlign: 'center'
	},
	icon: {
		color: theme.palette.error.main,
		width: '50px',
		height: '50px'
	}
});

const Def = class LoadFailure extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		retryHandler: PropTypes.func,
		isConnected: PropTypes.bool
	}

	onClick = () => {
		this.props.retryHandler();
	}

	render() {
		const { classes, isConnected } = this.props;
		return <div className={classes.root}>
			<div className={classes.warning}>
				<ErrorIcon className={classes.icon}/>
				{isConnected ?
					<div>
						<Typography>Sever error - unable to load the app!</Typography>
						<Button color="primary" onClick={this.onClick}>Retry</Button>
					</div> :
					<Typography>Cannot be loaded. Error with the server or connection issue.</Typography>
				}
			</div>
		</div>;
	}
};

Def.propTypes = {
	classes: PropTypes.object.isRequired
};

const LoadFailure = withStyles(styles)(Def);
export default LoadFailure;