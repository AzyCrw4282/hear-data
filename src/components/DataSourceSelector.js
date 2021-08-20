/*
* This component functions the soruce of data into the program.
* It can be given by the given file types or alternatively via
* (Todo:->) An API endpoint of acceptable file type (Button added)
* Credit: Azky & Library code
*/
import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import { createConfirmation } from 'react-confirm';

import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ViewListIcon from '@material-ui/icons/ViewList';
import Typography from '@material-ui/core/Typography';
import InfoIcon from '@material-ui/icons/Info';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import * as dataLibrary from '../assets/dataLibrary';
import parseSpreadSheet from '../util/data';
import { sampleIdRegex } from '../util/regex';
import ConfirmModal from './ConfirmationModal';
import WelcomeDialog from './WelcomeModal';
import AssetSelectDialog from './AssetSelectHandler';

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

const confirmDialog = createConfirmation(ConfirmModal);
const allowedFormats = [
    'text/csv',
    '.txt',
    '.xls',
    '.xlsx',
    '.csv',
    'Api-Endpoint'
]
function assetSort(a, b) {
	const aTitle = a.metadata.title.toLowerCase();
	const bTitle = b.metadata.title.toLowerCase();
	if (aTitle !== bTitle) {
		return aTitle > bTitle ? 1 : -1;
	}

	if (a.permanent !== b.permanent) {
		return b.permanent - a.permanent;
	}

	return a.lastModified - b.lastModified;
}

const uploadRequirements = [
	'File types supported: .xls, .xlsx, .csv',
	`Please ensure they have Column headers`,
	`Maximum file size: ${Math.round(5 * 1024 * 1024 / (1024 * 1024) * 100) / 100}MB`
].map((text, i) =>
	<ListItem key={i} dense>
		<ListItemIcon><InfoIcon /></ListItemIcon>
		<ListItemText primary={text} />
	</ListItem>);

const dropZoneContent = <React.Fragment>
	<Typography>
			Drag and drop files here or click to search locally
	</Typography>
	<List dense>{uploadRequirements}</List>
</React.Fragment>;


const Def = class DataSourceSelector extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		onCloseState: PropTypes.func.isRequired,
		config: PropTypes.object.isRequired,
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

    onSelect = () => {
		const id = this.state.selectedId;
		console.log("137: " + this.props);
		const { dataSourceId } = this.props;
		console.log(dataSourceId);
		if (!dataSourceId) {
			this.setDataSourceId(id);
		} else if (id !== dataSourceId) {
			const confirmation = <React.Fragment>Changing source will reset your current environment. Are you sure you want to proceed?</React.Fragment>;
			confirmDialog({ confirmation, options: {
				no: 'Cancel',
				yes: 'Change Data Source'
			} }).then(() => {
				this.setDataSourceId(id);
			});
		}
		this.props.onClose();
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
			// console.log('datasource', 'sample', matchSample[1] || '');
		} else {
			console.log('datasource', 'upload', id);
		}
		this.props.setDataSourceId(id);
	}


	onUpload = content => {
		if (content.length) {
			const selectedId = content[0].id;
			if (selectedId) {
				this.setState({ selectedId });
			}
		}
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
		dataLibrary.subscribe(this.assetsUpdated);
	}

	assetsUpdated = assets => {
		const sorted = [...assets].sort(assetSort);
		this.setState({
			loading: false,
			assets: sorted
		});
	}

	render() {
		const {
			classes,
			config,
			...props
		} = this.props;

		if (config.showWelcome) {
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
			accept={allowedFormats}
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