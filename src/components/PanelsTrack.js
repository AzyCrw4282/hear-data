//Handles the source instruments and data selection of cards and *deleteion annd duplicate panel* -- Tbd 
//same for: Track.js + scaleTrackInstrumentSelect.js
//TBD: panl duplicate button, so another is created just like it!

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
		flexDirection: 'column'
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
        data: PropTypes.object,
        curTrack: PropTypes.object.isRequired,
        newTrack: PropTypes.func.isRequired
    }

    handleFieldChangeEvt = et => {
        const validateField = et.target.value >= 1 ? num(et.target.value, 0) : 0;
        const {curTrack, newTrack}= this.props;
        newTrack(Object.assign({},curTrack, {
            validateField
        }),curTrack.id);
    }


    handleInstrumentChangeEvt = evt => {
		const { newTrack } = this.props;
        const { name, value } = evt.target;
		const prevTrack = this.props.curTrack || {};
		const prevConfig = prevTrack.config || {};
		const prevScaleConfig = prevConfig.scale || {};

		const scale = {
			...prevScaleConfig
		};
		scale[name] = value;
		const config = {
			...oldConfig,
			scale
		};
		const track = {
			...oldTrack,
			config
		};
		newTrack(track, track.id);
    }


    render() {
        const {
            classes,
            data,
            curTrack,
            newTrack
        } = this.props
        
        const config =  {} || curTrack.config && curTrack.config.scale;
		const instrument = config.instrument || DEF_INSTRUMENT;

        //non-numerical data cannot be sonified
		const fields = !data || !data.fields ?
			[] :
			data.fields
				.map(({name, type, max, min}, ) => ({name, type, min, max, i}))
				.filter(({type, max, min}) => type !== 'string' && max !== min);


		return <React.Fragment>
			<WideSelect
				onChange={this.handleFieldChangeEvt}
				name="Data Fields"
				id={'Data Fields-' + curTrack.id}            
				label="Current Field"
				value={curTrack.intensityField > 0 ? curTrack.intensityField : ''}

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
				name="instrument"
				id={'track-instrument-' + curTrack.id}
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

const UpperPanelControls = connect(['data'], actions)(withStyles(styles)(Def));
export default UpperPanelControls;
    
