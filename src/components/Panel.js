/*
* Contains the panel structure as a container
* Adopted code from the credited project for front and back-end functions
*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { createConfirmation } from 'react-confirm';
import { SortableHandle as sortableHandle } from 'react-sortable-hoc';
import withStyles from '@material-ui/core/styles/withStyles';
import { lighten, darken } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import DraggableIcon from '@material-ui/icons/DragIndicator';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ConfirmationDialog from '../extensions/ConfirmModal';
import trackTypes from './PanelHandlers';
import IconButton from '../extensions/IconButton';
import BarChartPanel from './PanelChartHandler';
import PanelControls from './PanelControls';



const confirm = createConfirmation(ConfirmationDialog);

const styles = (theme) => ({
	root: {
		margin: theme.spacing.unit,
		display: 'flex'
	},
	expansionPanel: {
		flex: 1,
		margin: 0,
		borderRadius: 0,
		boxShadow: 'none',
		backgroundColor: 'transparent',
		'&:first-child': {
			borderRadius: 0
		},
		overflowX: 'hidden'
	},
    main: {
		flex: 1,
		flexDirection: 'column',
		'& > :last-child': {
			paddingRight: 0
		},
		overflowX: 'hidden'
	},
	expansionPanelSummary: {
		paddingRight: 0
	},
	expanded: {
		'& $main': {
			margin: '12px 0' // same as not expanded
		},
		'& $expandIcon': {
			transform: 'rotate(180deg)'
		}
	},

    formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	},
	barChart: {
		overflow: 'hidden',
		'&:last-child': {
			padding: 3
		}
	},
    expandIcon: {
		position: 'initial',
		top: 'auto',
		left: 'auto',
		transform: 'initial',
		alignSelf: 'start',
		marginTop: 12
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		'&:last-child': {
			paddingRight: theme.spacing.unit
		}
	},
	sortHandle: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: theme.palette.type !== 'dark' ?
			darken(theme.palette.background.paper, 0.05) :
			lighten(theme.palette.background.paper, 0.05),
		borderRadius: `0 ${theme.spacing.unit / 2}px ${theme.spacing.unit / 2}px 0`,
		cursor: 'grab'
	},

	details: {
		flexDirection: 'column'
	},

	actionButtons: {
		flexShrink: 1,
		textAlign: 'right',
		whiteSpace: 'nowrap'
	}
});


const DragHandle = sortableHandle(({className}) => <div className={className}><DraggableIcon/></div>);

const Def = class Panel extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		track: PropTypes.object.isRequired,
        setTrack: PropTypes.func.isRequired,
		nodeRef: PropTypes.func,
		data: PropTypes.object,
		sortIndex: PropTypes.number.isRequired
	}

	deleteTrack = evt => {
		evt.stopPropagation();

		const { track, setTrack } = this.props;
		const { id } = track;

		// todo: include track type and/or name
		const confirmation = <React.Fragment>Are you sure you want to delete this track? This cannot be undone.</React.Fragment>;
		confirm({ confirmation, options: {
			no: 'Cancel',
			yes: 'Delete'
		} }).then(() => {
			setTrack(null, id);
		}, () => {
			console.log('Delete track canceled');
		});
	}

	handleToggleMuted = () => {
		const { track, setTrack } = this.props;
		//sets track props objects to for store handlers.
		setTrack(Object.assign({}, track, { 
			muted: !track.muted
		}), track.id);
	}

	render() {
		const {
			classes,
			track,
			sortIndex,
			data
		} = this.props;

		const typeDef = trackTypes[track.type];
		const hasIntensity = !!typeDef.hasIntensity;
		const TypeIcon = typeDef.icon;
		const TypeHeaderControl = typeDef.headerControl || null;
		const TypeControls = typeDef.controls || null;

		const barchartField = hasIntensity && track.intensityField > -1 ?track.intensityField : track.filterField;

		return <div ref={ref => this.props.nodeRef(ref, track.id)} id={'track-' + sortIndex}>
			<Paper className={classes.root} elevation={1} id={'track-' + track.id}>
				<ExpansionPanel classes={{root: classes.expansionPanel}}>
					<ExpansionPanelSummary
						expandIcon={<ExpandMoreIcon />}
						classes={{
							root: classes.expansionPanelSummary,
							content: classes.main,
							expanded: classes.expanded,
							expandIcon: classes.expandIcon
						}}
						IconButtonProps={{
							'data-tour-id': 'bar-chart-visual'
						}}
					>					
						{barchartField > -1 ?
							<BarChartPanel
								classes={{root: classes.barChart}}
								data={data}
								fieldIndex={barchartField}
								filterField={track.filterField}
								filterValues={track.filterValues}
								min={track.filterRange && track.filterRange[0] || 0}
								max={track.filterRange ? track.filterRange[1] : 1}
								disabled={!!track.muted}
							/> :
							null
						}
						<div className={classes.header} data-tour-id={'track-control-header-' + sortIndex}>
								<IconButton label="Toggle Mute Track" className={classes.volumeButton} onClick={this.handleToggleMuted}>
									{ track.muted ? <VolumeOffIcon color="disabled" /> : <VolumeUpIcon color="action" /> }
								</IconButton>
								<IconButton onClick={this.deleteTrack} label="Delete Track">
									<DeleteIcon/>
								</IconButton>
						</div>							
						<div className={classes.header} data-tour-id={'track-control-header-' + sortIndex}>
							<Tooltip title={typeDef.name}>
								<TypeIcon color="action"/>
							</Tooltip>
							{TypeHeaderControl && <TypeHeaderControl track={track}/>}

						</div>
						{TypeControls && <TypeControls track={track}/>}
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.details}>
						<PanelControls track={track}/>
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<DragHandle className={classes.sortHandle}/>
			</Paper>
		</div>;
	}
};

const Panel = withStyles(styles)(
	connect(['data'], actions)(Def)
);
export default Panel;

