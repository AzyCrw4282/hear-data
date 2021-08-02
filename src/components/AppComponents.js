/*
* Main App components handler class. Code adopted from the credited project.

Clean this and and finish index.js. Then, code review for structure and file comparisons 
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

import Shell from './HeaderHandler';
import AppLoader from './AppLoader'; //Tbc - loading screen displayed under loding condition
import AppHeader from './Header';

import MainSpeechControls from './MainSpeechControls';
import PlayControls from './PlayControls';
import AudioSelectDialog from './AudioSelectDialog';
import DataSelectDialog from './DataSelectDialog';
import AddPanelButton from './AddPanelButton';
import UpgradePrompt from './UpgradePrompt';

import SectionLoader from './SectionLoader';
import LoadFailure from './Loader';
import asyncComponent from './AsyncHandler';

const TrackList = asyncComponent(() => import('./TrackList'), {
	load: SectionLoader,
	fail: LoadFailure
});
const DataTableView = asyncComponent(() => import('./DataTableView'), {
	load: SectionLoader,
	fail: LoadFailure,
	defer: true
});

const styles = (theme) => ({
	parent: {
		flex: 1,
		minHeight: 0,
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
	drawerOpen: {
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
		flexDirection: 'column',
		width: '100%',
		marginRight: '-' + '35%',
		overflow: 'hidden' 
	},
    generalControls: {
		padding: theme.spacing.unit,
		backgroundColor: theme.palette.type === 'dark' ?
			darken(theme.palette.background.paper, 0.05) :
			lighten(theme.palette.background.paper, 0.05)
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
		activeDialog: '' // todo: need this from unistore so track components can use it
	}

	handleDataToggle = () => {
		this.props.setConfig({
			showData: !this.props.config.showData
		});
	}

	handleCreateTrack = type => {
		this.props.createTrack(type);
	}

	componentWillUnmount() {
		this.props.releasePlayback(this.playBlockClaim);
	}

	closeDialog = () => {
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
			upgradeReady,
			loading,
			config
		} = this.props;

		if (loading) {
			return <AppLoader/>;
		}

		const {
			showTour
		} = config;

		const showData = config.showData && !!dataSource;

		const { activeDialog } = this.state;

		const appHeader = <AppHeader
			onDataToggle={this.handleDataToggle}
			selectDataSource={this.selectDataSource}
		/>;

		return <Shell header={appHeader}>
			<div className={classes.Compcontainer}>
				<main className={classes.parent}>
					<div className={classNames(classes.editor, {
						[classes.contentShift]: showData
					})}>
						<div className={classes.tracks}>
							{dataSource && <TrackList/>}
							<AddPanelButton
								className={classes.addTrackButton}
								onClick={this.handleCreateTrack}
							/>
						</div>
						{dataSource && <MainSpeechControls
							className={classes.generalControls}
							selectDataSource={this.selectDataSource}
						/>}
						<VUMeter backgroundColor={this.props.theme.palette.background.paper}/>
					</div>
					<Drawer
						variant="persistent"
						anchor={'right'}
						open={showData}
						className={showData ? classes.drawerOpen : ''}
						classes={{
							docked: classes.drawerDocked,
							paper: classes.drawerPaper
						}}
					><DataTableView/></Drawer>
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
			{activeDialog === 'audio' && <AudioSelectDialog
				open={true}
				onClose={this.closeDialog}
				onSelect={id => this.handleUpdateTrack({
					audioId: id
				})}
				disableBackdropClick={false}
				waiting={false}
			/>}
			{(activeDialog === 'data' || !dataSource) && <DataSelectDialog
				open={true}
				cancelable={!!dataSource}
				onClose={this.closeDialog}
				defaultSelectedId={dataSourceId}
				disableBackdropClick={false}
				waiting={false}
			/>}
			{showTour && <Tour
				run={!loading && showTour && !!dataSource}
			/>}
			<UpgradePrompt upgradeReady={upgradeReady}/>
		</Shell>;
	}

};

const App = withStyles(styles, { withTheme: true })(
	connect(['dataSource', 'dataSourceId', 'loading', 'config'], actions)(Def)
);

export default App;