/*
This component functions the soruce of data into the program.
It can be given by the given file types or alternatively via
(Todo:->) An API endpoint of acceptable file type (Button added)
*/
import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { createConfirmation } from 'react-confirm';
import { sampleIdRegex } from '../util/regex';
import { MAX_DATA_FILE_SIZE, UPLOAD_ROW_LIMIT } from '../constants';
import isMobile from 'ismobilejs';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import WelcomeDialog from './WelcomeDialog';
import AssetSelectDialog from './AssetSelectDialog';
import ViewListIcon from '@material-ui/icons/ViewList';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from './IconButton';
import ConfirmationDialog from './ConfirmationDialog';
import CheckIcon from '@material-ui/icons/Check';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as dataLibrary from '../assets/dataLibrary';
import parseSpreadSheet from '../util/data';

const styles = theme => ({
	table: {
		display: 'flex',
		flexDirection: 'column',
        flex: 3,
		overflowY: 'scroll',
        overflowX: 'scroll'
	},
	tableSection: {
		display: 'block'
	},
	tr: {
		display: 'grid',
		gridTemplateColumns: '1fr auto',
		height: 'auto',
		'& > th, & > td': {
			minHeight: 35,
			padding: `3px 0`,
			textIndent: theme.spacing.unit / 2,
            color: 'white'
		}
	},
	bodyRow: {
		cursor: 'pointer',
        color: 'transparent'
	},
	dataTitle: {
		flex: 1,
		textOverflow: 'ellipsis'
	},
	em: {
		color: theme.palette.text.primary
	},
	dropZone: {
		display: 'flex',
		flexDirection: 'column',
        color: 'blue'
	}
});

const confirmDialog = createConfirmation(ConfirmationDialog);
const allowedFormats = [
    'text/csv',
    '.txt',
    '.xls',
    '.xlsx',
    '.csv',
    'Api-Endpoint'
]
const dropZoneContent = <React.Fragment>
	<Typography>
		{isMobile.any ?
			'Click here to upload the file' :
			'Drag and drop files here or click to search locally'}
	</Typography>
	<List dense>{uploadRequirements}</List>
</React.Fragment>;

const uploadRequirements = [
	'File types supported: .xls, .xlsx, .csv',
	`Please ensure they have Column headers`,
	`Maximum file size: ${Math.round(5 * 1024 * 1024 / (1024 * 1024) * 100) / 100}MB`,
	`Up to 1000 rows of data`
].map((text, i) =>
	<ListItem key={i} dense>
		<ListItemIcon><InfoIcon /></ListItemIcon>
		<ListItemText primary={text} />
	</ListItem>);

const Def = class DataSourceSelector extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		onCloseState: PropTypes.func.isRequired,
		configState: PropTypes.object.isRequired,
		setConfigState: PropTypes.func.isRequired,
		dataSourceId: PropTypes.string,
		setDataSourceId: PropTypes.func.isRequired
	}

	state = {
		loading: true,
		assets: []
	}

	getStarted = () => {
		this.props.setConfig({
			showWelcome: false
		});
	}

	handleClickListItem = selectedId => {
		this.setState({
			selectedId
		});
	}

	handleDoubleClickListItem = selectedId => {
		this.setState({
			selectedId
		}, this.onSelect);
	}

	setDataSourceId = id => {
		const matchSample = sampleIdRegex.exec(id);
		if (matchSample) {
			logEvent('datasource', 'sample', matchSample[1] || '');
		} else {
			logEvent('datasource', 'upload', id);
		}
		this.props.setDataSourceId(id);
	}

	onSelect = () => {
		const id = this.state.selectedId;
		const { dataSourceId } = this.props;
		if (!dataSourceId) {
			this.setDataSourceId(id);
		} else if (id !== dataSourceId) {
			const confirmation = <React.Fragment>Changing data source will reset your work. This cannot be undone. Are you sure you want to proceed?</React.Fragment>;
			confirm({ confirmation, options: {
				no: 'Cancel',
				yes: 'Change Data Source'
			} }).then(() => {
				this.setDataSourceId(id);
			});
		}
		this.props.onClose();
	}

	onUpload = newAssets => {
		if (newAssets.length) {
			const selectedId = newAssets[0].id;
			if (selectedId) {
				this.setState({ selectedId });
			}
		}
	}

	assetsUpdated = assets => {
		const sorted = [...assets].sort(assetSort);
		this.setState({
			loading: false,
			assets: sorted
		});
	}

	componentDidMount() {
		dataLibrary.subscribe(this.assetsUpdated);
		if (this.props.dataSourceId) {
			this.setState({
				selectedId: this.props.dataSourceId
			});
		}
	}

	componentWillUnmount() {
		dataLibrary.unsubscribe(this.assetsUpdated);
	}


	render() {
		const {
			classes,
			configState,
			...props
		} = this.props;

		if (configState.showWelcome) {
			return <WelcomeDialog onClose={this.getStarted}/>;
		}

		const {
			assets,
			selectedId,
			loading
		} = this.state;

		return <AssetSelectDialog
			id="data-select"
			{...props}
			assetLibrary={dataLibrary}
			getFileData={parseSpreadSheet}
			title="Select Data Source"
			type="spreadsheet"
			accept={fileAcceptTypeString}
			loading={loading}
			disabled={!selectedId}
			onSelect={this.onSelect}
			onUpload={this.onUpload}
			dropZone={<div className={classes.dropZone}>{dropZoneContent}</div>}
		>
			<Typography variant="subtitle1">Pick any of the given data source or uploading a spreadsheet of your own!</Typography>
			<Table className={classes.table}>
				<TableBody className={classNames(classes.tableSection, classes.tableBody)}>{assets.map(({id, ...assetData}) => {
					const { title } = assetData.metadata;
					const selected = id === selectedId;
					const textColor = 'white';

					return <TableRow
						key={id}
                        className={classNames(classes.tr, classes.bodyRow)}
						selected={selected}
						onClick={() => this.handleClickListItem(id)}
						onDoubleClick={() => this.handleDoubleClickListItem(id)}
					    >
						<TableCell className={classes.colTitle} title={title}>
							<ViewListIcon className={'MUI-Icon'}/>
							<Typography className={classes.dataTitle} color={textColor}>{title}</Typography>
						</TableCell>
					</TableRow>;
				})}</TableBody>
			</Table>
		</AssetSelectDialog>;
	}

};

const DataSelectDialog = withStyles(styles)(
	connect(['config', 'dataSourceId'], actions)(Def)
);
export default DataSelectDialog;