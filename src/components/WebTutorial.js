//TBD
import React from 'react';
import Joyride, { ACTIONS, EVENTS } from 'react-joyride';
import { connect } from 'unistore/react';
import { actions } from '../store';

import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';

const tourStepDefaults = {
	disableBeacon: true
};

const tourContents = [
	{
		title: 'Select Data Source',
		content: `Click here to add a new data source`,
		target: '[data-tour-id="upload-data-source"]'
	},
    {
		title: 'Play & Control Buttons',
		content: 'Click here to interact with the media controls',
		target: '#play-controls [data-tour-id="play-button"]'
	},
	{ 
		title: 'Add Audio Panel',
		content: 'Click here to create another data panel to sonify additional fields and data',
		target: '[data-tour-id="add-panel"]'
	},
    { //Tbf
		title: 'Visual Display',
		content: 'The bar chart illusrates the visual variance of the graph',
		target: '[data-tour-id="bar-chart-visual"]'
	},
	{ //Tbf
		title: 'Visual Current Indicator',
		content: 'Whilst playing the sound, an indicator would indicate the current data of sonificaiton. It will be shown in a dark vertical bar',
		target: '[data-tour-id="add-track"]'
	},
    { 
		title: 'Field And Instrument',
		content: 'Change the current field of sonificaiton here. Instruments can also be changed in the adjacent box',
		target: '[data-tour-id="Instrument-Selection"]'
	},
	{
		title: 'Sound Adjustments',
		content: 'Adjust the tempo, octaves and volume in this section. This is also responsive during play of the sound',
		target: '[data-tour-id="Additional-Selection"]'
	},
    {
		title: 'Export Button',
		content: 'Click here to export your sonified data. ',
		target: '[data-tour-id="export-audio"]'
	},
	{
		title: 'Data Display panel',
		content: 'Click here to view the display of the current data source in a spreadsheet format',
		target: '[data-tour-id="data-display-panel"]'
	},
    {
		title: 'Reset Button',
		content: 'Click here to reset the project. Please note: this will fully reset the current state',
		target: '[data-tour-id="reset-project-button"]'
	},
	{
		title: 'Help Button',
		content: 'Press here to show this tour of the application',
		target: '[data-tour-id="show-tour-button"]'
	}
].map(step => ({
	...tourStepDefaults,
	...step
}));

const observerConfig = {
	childList: true,
	subtree: true
};

const tipLocale = {
	last: 'Got it!'
};

const lastStep= tourContents.length - 1;

const Def = class Tour extends React.Component {
	static propTypes = {
        config: PropTypes.object.isRequired,
		run: PropTypes.bool,
		theme: PropTypes.object.isRequired,
		setConfig: PropTypes.func.isRequired
	}

	state = {
		stepIndex: 0,
		run: true
	}

	observer = null
	joyride = null

	handleJoyrideCallback = tour => {
		const { action, index, type } = tour;
		if (type === EVENTS.TOUR_END || action === EVENTS.TOOLTIP_CLOSE || type === EVENTS.STEP_AFTER && index >= lastStep) {
			this.setState({
				stepIndex: 0,
				run: false
			});
			this.props.setConfig({
				showTour: false
			});
		} else if (type === EVENTS.STEP_AFTER) {
			this.setState({
				stepIndex: index + (action === ACTIONS.PREV ? -1 : 1)
			});
		}
	}

	joyrideRef = ref => {
		this.joyride = ref;
	}

	redraw = () => {
		if (this.joyride) {
			this.joyride.forceUpdate();
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.config.showTour !== this.props.config.showTour && this.props.config.showTour) {
			this.setState({
				stepIndex: 0
			});
		}
	}

	componentDidMount() {
		this.observer = new MutationObserver(this.redraw);
		this.observer.observe(document.body, observerConfig);
	}


	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}

	render() {
		const {
			theme
		} = this.props;

		const run = this.props.run !== false && this.state.run;
		const { stepIndex } = this.state;
		const tipStyles = {
			options: {
				primaryColor: theme.palette.primary.main,
				textColor: theme.palette.text.primary,
				arrowColor: theme.palette.background.paper,
				backgroundColor: theme.palette.background.paper,
				overlayColor: 'rgba(0, 0, 0, 0.5)',
				zIndex: 9000 // need to be in front of dialogs
			},
			tooltip: {
				padding: theme.spacing.unit * 3
			},
			tooltipContainer: {
				textAlign: 'center'
			},
			tooltipContent: {
				padding: `${theme.spacing.unit}px 1`
			},
			buttonClose: {
				padding: theme.spacing.unit * 2.5
			},
			buttonSkip: {
				paddingLeft: 0
			}
		};

		return <Joyride
			showSkipButton
			continuous
			disableScrollParentFix

			callback={this.handleJoyrideCallback}
			styles={tipStyles}
            debug={DEBUG}
            stepIndex={stepIndex}
			run={run}
			steps={tourContents}
			locale={tipLocale}
			floaterProps={{
				disableAnimation: true
			}}
			ref={this.joyrideRef}
		/>;
	}
};

const Tour = withStyles(styles, { withTheme: true })(
	connect(['config'], actions)(Def)
);
export default Tour;