import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import withStyles from '@material-ui/core/styles/withStyles';
import Fab from '@material-ui/core/Fab';
import Play from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import SkipPrevious from '@material-ui/icons/SkipPrevious';
import CircularProgress from '@material-ui/core/CircularProgress';

import Slider from './../extensions/Sliders';
import ExportAudioButton from './ExportBtnFunc';
// import DurationControl from './DurationControl';
import IconButton from '../extensions/IconButton';
import formatTime from './FormatTime';

const styles = theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		position: 'relative',
		padding: `${theme.spacing.unit}px 0`,
		maxWidth: '100%'
	},
	playPauseButton: {
		margin: theme.spacing.unit,
		marginLeft: '42%',
		marginRight: '50%',
		flexDirection: 'row'
	},
	main: {
		flex: 1,
		display: 'fixed',
		flexDirection: 'row',
		overflow: 'hidden'
	},
	progress: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: -5,
		zIndex: 1300,
        height: 10
	},
	progressSlider: {
		cursor: 'pointer'
	},
	restEleements: {
		display: 'flex',
		alignItems: 'center'
	},
	meta: {
		flex: 1,
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden'
	},
	loading: {
		color: theme.palette.grey[500]
	},
	time: {
		marginRight: theme.spacing.unit * 3,
		whiteSpace: 'nowrap'
	},
	skip: {},
	rewind: {},
	'@media (max-width: 400px)': {
		skip: {
			display: 'none'
		}
	},
	'@media (max-width: 440px)': {
		rewind: {
			display: 'none'
		},
		meta: {
			display: 'none'
		}
	}
});


const Def = class PlayControls extends React.Component {
	static propTypes = {
        duration: PropTypes.number,
		currentTime: PropTypes.number,
		data: PropTypes.object,
		play: PropTypes.func.isRequired,
		setCurrentTime: PropTypes.func.isRequired,
		audioLoaded: PropTypes.bool,
		paused: PropTypes.bool,
		pause: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired,
		disabled: PropTypes.bool,
		loading: PropTypes.bool
	}

	rewindBeginning = () => {
		this.props.setCurrentTime(0);
	}

	componentDidMount() {
		document.addEventListener('keypress', this.keyPress, false);
	}

	componentWillUnmount() {
		document.removeEventListener('keypress', this.keyPress, false);
	}

	render() {
		const {
			classes,
			disabled,
			loading,
			audioLoaded,
			paused,
			pause,
			play,
			setCurrentTime,
			duration,
			currentTime
		} = this.props;

		const roundedDuration = duration || 0;
		let minTimeUnits = 0;
        if (roundedDuration < 3600){
            minTimeUnits = 2;
        }else{
            minTimeUnits = 3;
        }

		return <div className={classes.root} id="play-controls">
			<h2 id="media-Controls1" className={classes.offscreen} aria-describedby="currently-playing-title"></h2>
			<div className={classes.progress}>
				<Slider
					className={classes.progressSlider}
					min={0}
					max={duration || 1}
					step={0.000001}
					value={currentTime}
					tipFormatter={v => formatTime(v, minTimeUnits)}
					onChange={setCurrentTime}
					disabled={disabled}
				/>
			</div>
			<div className={classes.playPauseButton} data-tour-id="play-button">
				{ !loading || audioLoaded ?
					!paused || !disabled ?
						<IconButton
							component={Fab}
							color="transparent"
							label="Pause"
							onClick={pause}
						>
						<Pause />
						</IconButton> :
                        <IconButton
                        component={Fab}
                        color="primary"
                        disabled={disabled || !audioLoaded}
                        label="Play"
                        onClick={play}
                        >
                        <Play />
                        </IconButton> :
					<CircularProgress size={100}  classes={{colorPrimary: classes.loading}}/>
				}

					<IconButton disabled={disabled} className={classes.rewind} label="Reset" onClick={this.rewindBeginning}>
						<SkipPrevious />
					</IconButton>
					{/* <DurationControl/> */}

				<ExportAudioButton/>	
			</div>
		</div>;
	}
};

const PlayControls = withStyles(styles)(
	connect(['duration', 'currentTime', 'currentRow', 'paused', 'audioLoaded', 'data'], actions)(Def)
);
export default PlayControls;
