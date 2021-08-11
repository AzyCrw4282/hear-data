import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import asyncComponent from '../extensions/AsyncHandler';

const ExportAudioDialog = asyncComponent(() => import('./ExportAudioModal'), {
	defer: true
});

const styles = theme => ({
	button: {
		margin: 4,
        color: 'primary',

	},
	leftIcon: {
		marginRight: theme.spacing.unit
	}
});

const Def = class ExportAudioBtn extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		classes: PropTypes.object,
		loading: PropTypes.bool,
		disabled: PropTypes.bool,
		audioLoaded: PropTypes.bool
	}


	state = {
		open: false
	}

	exportAudioAction = () => {
		this.setState({
			open: true
		});
	}

	onCloseAction = () => {
		this.setState({
			open: false
		});
	}

	render() {
		const {
			classes,
			disabled,
			loading,
			audioLoaded
		} = this.props;

		const { open } = this.state;

		return <React.Fragment>
			<Button
				disabled={disabled || loading || !audioLoaded}
				variant="contained"
				color="secondary"
                aria-label = 'Open modal for options'
				onClick={this.exportAudioAction}
				className={classes.button}
				data-tour-id="export-audio"
			>
			<DownloadIcon className={classes.leftIcon} />
				Export
			</Button>
			{open && <ExportAudioDialog open={true} onClose={this.onCloseAction}/>}
		</React.Fragment>;
	}
};

const ExportAudioBtn = withStyles(styles)(
	connect([
		'loading',
		'disabled',
		'audioLoaded'
	], actions)(Def)
);
// const ExportAudio = Def;
export default ExportAudioBtn;