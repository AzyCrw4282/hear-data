// Tested
//Handles the source instruments and data selection of cards and *deleteion annd duplicate panel* -- Tbd 
//same for: Track.js + scaleTrackInstrumentSelect.js
//Tbd: panl duplicate button, so another is created just like it!

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import WideSelect from './WideSelect';
import { connect } from 'unistore/react';
import { actions } from '../store';
import num from '../extension/dataLibrary';
const styles = () => ({
    container: {
		display: 'flex',
		flexDirection: 'row'
    },
    selectedField: {
        flex: 0.5
    },
    selectedInstrument: {
        flex: 0.5
    }
});

const DEF_INSTRUMENT = 'Piano';

const Def = class UpperPanelControls extends React.Component {

    static PropTypes = {
        classes: PropTypes.object.isRequired,
        track: PropTypes.object.isRequired,
        setTrack: PropTypes.func.isRequired,
		data: PropTypes.object
    }

    handleFieldChangeEvt = et => {
        const intensityField = et.target.value >= 1 ? num(et.target.value, 0) : 0;
        const {track, setTrack}= this.props;
        setTrack(Object.assign({},track, {
            intensityField
        }),track.id);
    }


    handleInstrumentChangeEvt = evt => {
		const { setTrack } = this.props;
        const { name, value } = evt.target;
		const prevTrack = this.props.track || {};
		const prevConfig = prevTrack.config || {};
		const prevScaleConfig = prevConfig.scale || {};

		const scale = {
			...prevScaleConfig
		};
		scale[name] = value;
		const config = {
			...prevConfig,
			scale
		};
		const track = {
			...prevTrack,
			config
		};
		setTrack(track, track.id);
    }


    render() {
        const {
            classes,
            data,
            track
        } = this.props
        
        const configuration = track.config && track.config.scale || {} ;
		const instrument =  configuration.instrument || DEF_INSTRUMENT;
		console.log(DEF_INSTRUMENT, configuration.instrument,DEF_INSTRUMENT || configuration.instrument)

        //non-numerical data cannot be sonified
		const fields = !data || !data.fields ?
			[] :
			data.fields
				.map(({name, type, max, min}, i) => ({name, type, min, max, i}))
				.filter(({type, max, min}) => type !== 'string' && max !== min);

		return <React.Fragment>
			<WideSelect
				name="field-value"
				id={'intensity-field-' + track.id}  			
				onChange={this.handleFieldChangeEvt}
				label="Current Field"
				value={track.intensityField > -1 ? track.intensityField : ''}
				classes={{
					root: classes.selectedField
				}}
			>
				<MenuItem value="">
					<em>None</em>
				</MenuItem>
				{fields
					.map(({name, i}) => <MenuItem value={i+1} key={i+1}>{name}</MenuItem>)
                }
			</WideSelect>
			<WideSelect
				name="Instrument"
				id={'track-instrument-' + track.id}
				value={instrument}          
				label="Instrument"
				onChange={this.handleInstrumentChangeEvt}
				inputProps={{
					name: 'instrument'
				}}
				classes={{
					root: classes.selectedInstrument
				}}
			>
				<MenuItem value="piano">Piano</MenuItem>
                <MenuItem value="violin">Violin</MenuItem>
				<MenuItem value="trumpet">Trumpet</MenuItem>
				<MenuItem value="electricGuitar">Guitar</MenuItem>
				<MenuItem value="oscillator">Oscillator</MenuItem>
			</WideSelect>
		</React.Fragment>;
    }
};

// const ScaleTrackInstrumentSelect = connect(['data'], actions)(withStyles(styles)(Def));
// export default ScaleTrackInstrumentSelect;
    

const UpperPanelControls = connect(['data'], actions)(withStyles(styles)(Def));
export default UpperPanelControls;
    
