/*
Library code that enables panel control
*/
import React from 'react';
// import classNames from 'classnames';
import { connect } from 'unistore/react';
import { actions } from '../store';
import num from '../extensions/num';
import formatData from './FormatData';

/*
Material UI components
*/
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import trackTypes from './PanelHandlers';

const styles = theme => ({
	controlsCategory: {
		display: 'flex',
		flexDirection: 'row'
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
    volumeButton: {
		height: theme.spacing.unit * 4,
		width: theme.spacing.unit * 4,
		'& > span': {
			// hack to fix vertical alignment
			marginTop: -8
		}
	},
	sliderContainer: {
		marginTop: 16,
		minHeight: '1.1875em',
		padding: [[6, 0, 4, 8]]
	},
	volumeControl: {
		display: 'inline-flex',
		alignItems: 'center',
		marginTop: theme.spacing.unit * 2
	},

	slider: {
		width: 300,
		display: 'inline-block'
	}
});

const Def = class PanelControls extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		track: PropTypes.object.isRequired,
		data: PropTypes.object,
		setTrack: PropTypes.func.isRequired
	}

	handleChangeVolume = val => {
		const { track, setTrack } = this.props;
		setTrack(Object.assign({}, track, {
			volume: val
		}), track.id);
	}

	handleToggleMuted = () => {
		const { track, setTrack } = this.props;
		setTrack(Object.assign({}, track, {
			muted: !track.muted
		}), track.id);
	}

	handleChangeFilterField = event => {
		const filterField = event.target.value >= 0 ? num(event.target.value, -1) : -1;
		const { track, setTrack } = this.props;

		// clear filter values if field changes
		const filterValues = filterField !== track.filterField ? [] : track.filterValues;

		setTrack(Object.assign({}, track, {
			filterField,
			filterValues
		}), track.id);
	}

	handleChangeFilterRange = filterRange => {
		const { track, setTrack } = this.props;

		// workaround for rc-slider bug (see below)
		// todo: remove when bug is fixed
		filterRange[0] = Math.max(0, filterRange[0]);
		filterRange[1] = Math.min(1, filterRange[1]);

		setTrack(Object.assign({}, track, {
			filterRange
		}), track.id);
	}

	handleChangeFilterSelect = event => {
		const filterValues = event.target.value || [];
		const { track, setTrack } = this.props;

		setTrack(Object.assign({}, track, {
			filterValues
		}), track.id);
	}

	render() {
		const {
			classes,
			track,
			data
		} = this.props;

		const typeDef = trackTypes[track.type];
		const hasIntensity = !!typeDef.hasIntensity;
		const TypeControls = typeDef.advanced || null;

		const hasFilterField = track.filterField >= 0 &&
			track.filterField < data.fields.length &&
			typeof track.filterField === 'number';
		const filterFieldIndex = !hasIntensity || hasFilterField ?
			track.filterField :
			track.intensityField;

		const filterField = filterFieldIndex >= 0 && data ? data.fields[filterFieldIndex] : null;

		const filterMin = filterField && filterField.type === 'datetime' ?
			filterField.min :
			num(filterField && filterField.min, 0);
		const filterMax = filterField && filterField.type === 'datetime' ?
			filterField.max :
			num(filterField && filterField.max, 1);
		const filterRange = filterMax - filterMin;
		const filterStep = filterField && (filterField.step || 0) * filterField.scale;

		// todo: support non-numeric fields? And any improvements to this?
		const fields = !data || !data.fields ?
			[] :
			data.fields
				.map((field, i) => ({...field, i}))
				.filter(({type, max, min, values}) => max !== min || type === 'string' && values && values.length);

		return <React.Fragment>
			<div className={classes.controlsCategory}>
			</div>
			{TypeControls && <div className={classes.controlsCategory}>
				<TypeControls track={track}/>
			</div>}
		</React.Fragment>;
	}
};

const PanelControls = withStyles(styles)(
	connect(['data'], actions)(Def)
);
export default PanelControls;