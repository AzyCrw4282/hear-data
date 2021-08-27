/*
* The media controls for octaves, track temp  and volume slider
* Credit: Azky & Library code
*/
import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import {
	DEFAULT_SCALE_RANGE,
	DEFAULT_INSTRUMENT
} from '../constants';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import Slider from './../extensions/Sliders';
import IconButton from '../extensions/IconButton';
import num from '../extensions/num';
import { instruments as samplerInstruments } from '../engine/types/scale/samplerInstruments';
import synthInstruments from '../engine/types/scale/synthInstruments';

const instruments = {
	...samplerInstruments,
	...synthInstruments
};

const styles = theme => ({
	root: {
		// display: 'flex',
		// alignItems: 'flex-end'
	},
	keyControlGroup: {
		flexDirection: 'column',
		alignItems: 'flex-end',
		margin: theme.spacing.unit,
		minWidth: 70,
		'& > label': {
			whiteSpace: 'nowrap'
		}
	},
	slider: {
		width: 300,
		display: 'inline-block'
	},
    formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	volumeControl: {
		display: 'inline-flex',
		alignItems: 'center',
		marginTop: theme.spacing.unit * 2
	},
});

//Cosntructs a menuitem of octaves with IDs
const octavesConstructorMenu = range => Array.from(Array(range), (n, i) => {
	const octaves = i + 1;
	const label = i ? `${octaves} Octaves` : '1 Octave';
	return <MenuItem value={octaves} key={octaves}>{label}</MenuItem>;
});

const Def = class PanelMediaControls extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		track: PropTypes.object.isRequired,
		data: PropTypes.object,
		setTrack: PropTypes.func.isRequired
	}

	modifiedTrackConfig = (prevTrackNote, name, value) => {
		const oldConfig = prevTrackNote.config || {};
		const oldScaleConfig = oldConfig.scale || {};

		const scaleNote = {
			...oldScaleConfig,
			[name]: value
		};

		const configNote = {
			...oldConfig,
			scaleNote
		};

		const track = {
			...oldTrack,
			configNote
		};
		return track;
	}

	handleOctaveScale= event => {
		const octaves = event.target.value;
		const scaleRange = octaves * 7 + 1; // inclusive
		const { setTrack } = this.props;
		const oldTrack = this.props.track || {};
		const track = this.modifiedTrackConfig(oldTrack, 'scaleRange', scaleRange);
		setTrack(track, track.id);
	}

	handleSoundFilter = event => {
		const { setTrack } = this.props;
		const oldTrack = this.props.track || {};
		const { name, value } = event.target;
		const track = this.modifiedTrackConfig(oldTrack, name, value);
		setTrack(track, track.id);
	}

	handleToggleVolume = () => {
		const { track, setTrack } = this.props;
		setTrack(Object.assign({}, track, {
			muted: !track.muted
		}), track.id);
	}

	render() {
		const {
			classes,
			track
		} = this.props;

		const config = track.config && track.config.scale || {};
		const scaleRange = num(config.scaleRange, DEFAULT_SCALE_RANGE);
		const tempoFactor = num(config.tempoFactor, 1);
		const { minOctave, maxOctave } = instruments[config.instrument] || instruments[DEFAULT_INSTRUMENT];
		const scaleRangeOctaves = Math.max(1, Math.min(maxOctave - minOctave + 1, Math.floor(scaleRange / 7)));
		const maxOctaveRange = 1 + maxOctave - minOctave;

		return <div className={classes.root} data-tour-id="Additional-Selection">
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor="track-volume" shrink={true}>Volume</InputLabel>
                <div className={classes.volumeControl}>
                    <IconButton label="Toggle Mute Track" className={classes.volumeButton} onClick={this.handleToggleMuted}>
                        { track.muted ? <VolumeOffIcon color="disabled" /> : <VolumeUpIcon color="action" /> }
                    </IconButton>
                    <Slider
                        className={classes.slider}
                        min={0}
                        max={1}
                        step={0.000001}
                        disabled={!!track.muted}
                        value={track.volume === undefined ? 1 : track.volume}
                        onChange={this.handleToggleVolume}
                    />
                </div>
            </FormControl>           
			{maxOctaveRange > 1 ? 
            <FormControl className={classes.keyControlGroup}>
				<InputLabel htmlFor={'track-scale-range-' + track.id}>Octave Scale</InputLabel>
				<Select
					value={Math.min(maxOctaveRange, scaleRangeOctaves)}
					onChange={this.handleChangeOctave}
					inputProps={{
						name: 'track-scale-range',
						id: 'track-scale-range-' + track.id
					}}
				>
					{octavesConstructorMenu(maxOctaveRange)}
				</Select>
			</FormControl> 
            : 
            null}
			<FormControl className={classes.keyControlGroup}>
				<InputLabel htmlFor={'track-tempo-factor-' + track.id} >Tempo</InputLabel>
				<Select
					value={tempoFactor}
					onChange={this.handleSoundFilter}
					inputProps={{
						name: 'tempoFactor',
						id: 'track-tempo-factor-' + track.id
					}}
				>
					<MenuItem value={2}>2x</MenuItem>
					<MenuItem value={4}>4x</MenuItem>
					<MenuItem value={8}>8x</MenuItem>
				</Select>
			</FormControl>
		</div>;
	}
};
const PanelMediaControls = withStyles(styles)(
	connect(['data'], actions)(Def)
);
export default PanelMediaControls;