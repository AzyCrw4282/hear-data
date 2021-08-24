/*
* This component handles the downloading of the notes locally.
* Credit: Azky & Library code
*/

import React from 'react';
import { connect } from 'unistore/react';
import { actions } from '../store';
import ExportEngine from '../engine/ExportEngine';
import setStateFromEvent from '../extensions/setStateFromEvents';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = () => ({
	ExportButton: {
		margin: 4,
        color: 'primary',

	},
    CancelButton: {
        color: 'secondary',
        margin: 4
    },    
    Dialog: {
        minHeight: '350px',
        maxHeight: '400px',
        minWidth: '350px',
        maxWidth: '400px',
    }

});

const sampleRate = 44100;

const Def = class ExportModal extends React.Component {
	static propTypes = {
        durationVal: PropTypes.number.isRequired,
		blockPlayback: PropTypes.func.isRequired,
		releasePlayback: PropTypes.func.isRequired,
		setConfig: PropTypes.func.isRequired,
		classes: PropTypes.object,
		configState: PropTypes.object,
		openBool: PropTypes.bool,
		dataValues: PropTypes.object,
		onCloseState: PropTypes.func.isRequired
	}

	state = {
		rdyToExport: false,
		fileType: 'mp3',
		bitValue: 128,
		loadValue: 0,
		error: '',
		fetchURL: '',
        fetchRdy: ''
	}
	engine = null
	playRequest= Symbol()

	onProgress = () => {
		const progress = this.engine && this.engine.progress || 0; //sets bool condition of 0 or 1
		this.setState({ progress });
	}

    exportAudioHandler = async() =>{
        this.props.blockPlayback(this.playRequest);
        const {format, bitRates} = this.state;
        const engine = new ExportEngine(this.props,{format, bitRates,sampleRate});
        this.engine = engine;

        this.setState.setConfig({
            format,
            bitRates
        });

        engine.on('progress',this.onProgress)
        this.setState({
			error: '',
			rdyToExport: true,
			loadValue: 0,
			fetchURL: ''
		});

        let constructFile = null;
        let error = '';
        try{
            constructFile = await engine.start();
        }catch(e){
            console.log('Error during engine operation ',e);
            error = 'error occurred.';
        }

        engine.destroy();
        this.clearEngine();

        if (constructFile){
            if (!error && constructFile != null){
                saveAs(constructFile, this.props.dataValues.file || 'HearData Sounds' + '.mp3');
				if (this.props.onCloseState) {
					this.props.onCloseState();
				}
			}
        }
    }


	clearEngine = () => {
		if (this.engine) {
			this.engine.destroy();
            this.engine = null;
		}
	}

	cancel = () => {
		if (this.state.rdyToExport) {
			this.clearEngine();
		} else if (this.props.onCloseState) {
			this.props.onCloseState();
		}
	}

	handleChangeValue = setStateFromEvent(this)
	componentDidMount() {
		const { configProps } = this.props;
		const { bitRate, format } = configProps;
		if (bitRate && format) {
			this.setState({
				bitRate,
				format
			});
		}
	}

	componentWillUnmount() {
		this.clearEngine();
	}

	render() {
		const {
			classes,
			openBool
		} = this.props;

		const {
			rdyToExport,
			error,
			loadValue,
			fileType,
			bitValue,
		} = this.state;

		const soundSize =  duration * bitRate * 1024 / 8;

		const innerElements = rdyToExport ?
			<div>
				<DialogContentText id="export-audio-dialog-description">
					Downloading Audio File
				</DialogContentText>
				<LinearProgress
					variant="determinate"
					value={loadValue * 100}
                    color = 'primary'
				/>
			</div> 
			:
			<div>
				<DialogContentText id="export-audio-dialog-description" >
					Download The Sounds locally
				</DialogContentText>
				{error && <DialogContentText color="error">{error}</DialogContentText>}
				<div>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="export-format">Format</InputLabel>
						<Select
							value={fileType}
							onChange={this.handleChangeValue}
							name="format"
							input={<Input id="export-format" />}
						>
							<MenuItem value="mp3">MP3</MenuItem>
						</Select>
					</FormControl>
					{<FormControl className={classes.formControl}>
						<InputLabel htmlFor="export-bit-rate">Bit Rate</InputLabel>
						<Select
							value={bitValue}
							onChange={this.handleChangeValue}
							name="bitRate"
							input={<Input id="export-bit-rate" />}
						>
							{bitRates.map(bits => <MenuItem value={bits} key={bits}>{bits} kbps</MenuItem>)}
						</Select>
					</FormControl> }
				</div>
				<DialogContentText id="export-audio-file-size">
					~File Size: {formatFileSize(soundSize)}
				</DialogContentText>
			</div>;

		return <Dialog
			open={openBool !== false}
			onClose={this.close}
			keepMounted={true}
			disableBackdropClick={exporting}
			classes={{
				paper: classes.ExportButton
			}}
		    >   
			<DialogTitle id="export-audio-dialog-title">Download Audio</DialogTitle>
			<DialogContent width="50%">
				{innerElements}
			</DialogContent>
			<DialogActions>
				<Button class = {classes.CancelButton} onClick={this.cancel} color="secondary">
					Cancel
				</Button>
				<Button onClick={this.exportAudioHandler} color="secondary" autoFocus disabled={exporting}>
					Download
				</Button>
			</DialogActions>
		</Dialog>;
	}
};

const ExportAudioDialog = withStyles(styles)(
	connect([
		'data',
		'tracks',
		'config',
		'rowDuration',
		'duration',
		'dataSource',
	], actions)(Def)
);

export default ExportAudioDialog;    
