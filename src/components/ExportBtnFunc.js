import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import asyncComponent from './asyncComponent';

const ExportAudioDialog = asyncComponent(() => import('./ExportAudioDialog'), {
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
        audioSetState: PropTypes.bool,
        loadingState: PropTypes.bool,
		disabledState: PropTypes.bool,
		audioLoadedState: PropTypes.bool,
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
			disabledState,
			loadingState,
			audioLoadedState
		} = this.props;

		const { open } = this.state;

		return <React.Fragment>
			<Button
				disabled={disabledState || loadingState || !audioLoadedState}
				variant="contained"
				color="Primary"
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
		'loadingState',
		'disabledState',
		'audioLoadedState'
	], actions)(Def)
);
// const ExportAudio = Def;
export default ExportAudioBtn;