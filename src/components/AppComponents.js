/*
* Main App components handler class. Code adopted from the credited project.
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import '../engine/live-events';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';
import { lighten, darken } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';

import VolumeBar from './VolumeBar'
import Shell from './HeaderHandler';
import AppHeader from './Header';//Tbc - loading screen displayed under loding condition
import PlayControls from './MediaControls';
import DataSelectDialog from './DataSourceSelector';
import AddPanelButton from './AddPanelButton';
import SectionLoader from './../extensions/LoaderFunction';
import LoadFailure from './Loader';
import Loader from './LoaderSuccess';

import asyncComponent from './../extensions/AsyncHandler';


const DataTableView = asyncComponent(() => import('./DataPanelComponent'), {
	load: SectionLoader,
	fail: LoadFailure,
	defer: true
});

const TrackPanels = asyncComponent(() => import('./PanelsLoader'), {
	load: SectionLoader,
	fail: LoadFailure
});

const AppTour = asyncComponent(() => import('./WebTutorial'));


const styles = (theme) => ({
	parent: {
		flex: 1,
		minHeight: 1,
		display: 'flex',
		overflow: 'hidden' // so we don't get weird drop shadows on sides
	},
    Compcontainer: {
		flex: 1,
        overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
	},
    playBar: {
		width: '100%',
        alignItems: 'center',
		display: 'flex',
		backgroundColor: theme.palette.type !== 'dark' ?
			darken(theme.palette.background.paper, 0.05) :
			lighten(theme.palette.background.paper, 0.05)
	},
	drawerActive: {
		'&$drawerDocked': {
			'@media (max-width: 640px)': {
				minWidth: '35%',
				width: 320,
				maxWidth: '100%'
			}
		}
	},
	editor: {
		display: 'flex',
		width: '100%',
		marginRight: '-' + '35%',
		flexDirection: 'column',
		overflow: 'hidden' 
	},
	tracks: {
		flex: 1,
		margin: theme.spacing.unit * 1,
		position: 'relative'
	},
	addTrackButton: {
		position: 'absolute',
		bottom: theme.spacing.unit * 1,
		right: theme.spacing.unit * 2
	},
	'@media (max-width: 650px)': {
		contentShift: {
			marginRight: '-' + '35%'
		}
	},
    playControls: {
		flex: 1
	},
	drawerDocked: {
		width: '35%'
	},
	drawerPaper: {
		position: 'relative'
	},
	contentRightMargin: {
		marginRight: 0
	}
});

const Def = class App extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		releasePlayback: PropTypes.func.isRequired,
		setConfig: PropTypes.func.isRequired,
		createTrack: PropTypes.func.isRequired,
		config: PropTypes.object,
        blockPlayback: PropTypes.func.isRequired,
		dataSource: PropTypes.object,
		dataSourceId: PropTypes.string,
		setDataSourceId: PropTypes.func.isRequired,
		loading: PropTypes.bool,
		upgradeReady: PropTypes.bool,
        theme: PropTypes.object.isRequired
	}

	playBlockClaim = Symbol()

	state = {
		activeDialog: ''
	}

	handleHeaderToggle = () => {
		this.props.setConfig({
			showData: !this.props.config.showData
		});
	}

	handleAddTrack = type => {
		this.props.createTrack(type);
	}

	componentWillUnmount() {
		this.props.releasePlayback(this.playBlockClaim);
	}

	closeModal = () => {
		this.props.releasePlayback(this.playBlockClaim);
		this.setState({
			activeDialog: ''
		});
	}

	selectDataSource = () => {
		this.props.blockPlayback(this.playBlockClaim);
		this.setState({
			activeDialog: 'data'
		});
	}

    render() {
		const {
			classes,
			dataSource,
			dataSourceId,
			loading,
			config
		} = this.props;

		if (loading) {
			return <Loader/>;
		}

		const {
			showTour
		} = config;

		const showData = config.showData && !!dataSource;

		const { activeDialog } = this.state;

		const appHeader = <AppHeader
			onDataToggle={this.handleHeaderToggle}
			selectDataSource={this.selectDataSource}
		/>;

		/* Controls the layering of the mechanism by the use of default rows of the flex */
		return <Shell header={appHeader}>
			<div className={classes.Compcontainer}>
				<main className={classes.parent}>
					<div className={classNames(classes.editor, {
						[classes.contentRightMargin]: showData
					})}>
						<div className={classes.tracks}>
							{dataSource && <TrackPanels/>}
							<AddPanelButton
								className={classes.addTrackButton}
								onClick={this.handleAddTrack}
							/>
						</div>
						<VolumeBar backgroundColor='white'/>
					</div>
					{/* By defalt config of left is set for drawer*/}
					<Drawer
						variant="persistent"
						anchor = {'right'}
						open={showData}
						className={showData ? classes.drawerActive : ''}
						classes={{
							docked: classes.drawerDocked,
							paper: classes.drawerPaper
						}}
					>
						<DataTableView/>
					</Drawer>
				</main>
				<Paper className={classes.playBar} square elevation={8}>
					<PlayControls
						classes={{
							root: classes.playControls
						}}
						disabled={!dataSource}
					/>
				</Paper>
			</div>
			{(activeDialog === 'data' || !dataSource) && <DataSelectDialog
				open={true}
				cancelable={!!dataSource}
				onClose={this.closeModal}
				defaultSelectedId={dataSourceId}
				disableBackdropClick={false}
				waiting={false}
			/>}
			{showTour && <AppTour
				run={!loading && showTour && !!dataSource}
			/>}
		</Shell>;
	}
};

const App = withStyles(styles, { withTheme: true })(
	connect(['dataSource', 'dataSourceId', 'loading', 'config'], actions)(Def)
);
export default App;