// Handles the visual aspect of the sonificaiton.
/*This componenet creates the line chart and is then enhanced by the canvasEnhancer
component. 

e.g.-> Barchart -> TrackBarChart -> Track

*/
import React from 'react';
import PropTypes from 'prop-types';
import CanvasEnhancer from './../extensions/CanvasHandler';
import RemountOnResize from '../store/RemountOnResize';


const defaultColors = {
	main: 'darkred',
	selected: 'red',
	disabled: 'lightgray',
	disabledSelected: 'gray'
};

const Def = class LineChartPanel extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		data: PropTypes.object,
		rowIndex: PropTypes.number,
		fieldIndex: PropTypes.number,
		filterField: PropTypes.number,
		filterValues: PropTypes.arrayOf(PropTypes.string),
		colors: PropTypes.object,
		min: PropTypes.number,
		max: PropTypes.number
	}

	paint = ctx => {
		const {
			data,
			rowIndex,
			fieldIndex,
			min,
			max,
			filterValues,
			colors
		} = this.props;


		const hasFilterField = this.props.filterField >= 0 &&
			this.props.filterField < data.fields.length &&
			typeof this.props.filterField === 'number';
		const filterFields = hasFilterField ?
			this.props.filterField :
			fieldIndex;
		const filterByString = hasFilterField && data.fields[filterField].type === 'string';

		const ratio = window.devicePixelRatio;
		const { width, height } = ctx.canvas;
		const { normalized, rows } = data;
		const rowCounts = normalized.length;
		const horizDist = width / rowCounts;
		const w = Math.max(horizDist - ratio, 1);

		const field = data.fields[fieldIndex];
		const zero = field.type === 'int' || field.type === 'float' ?
			Math.max(0, Math.min(1, -field.min * field.scale)) :
			0;
		const yPoint = height * (1 - zero);
		const zeroHeight = zero < 0.5 ? -ratio : ratio;

		const {
			main,
			selected,
			disabled,
			disabledSelected
		} = { ...defaultColors, ...colors };

		ctx.beginPath();
		console.log(rowCounts);
		for (let i = 0; i < rowCounts; i++) {
			const val = normalized[i][fieldIndex];
			const filterVal = filterByString ?
				rows[i][filterFields] :
				normalized[i][filterFields];

			if (!isNaN(val)) {
				const passesFilter = filterByString ?
					!filterValues || !filterValues.length || filterValues.indexOf(filterVal) > -1 :
					filterVal >= min && filterVal <= max;

				if (passesFilter) {
					ctx.fillStyle = i === rowIndex ? selected : main;
				} else {
					ctx.fillStyle = i === rowIndex ? disabledSelected : disabled;
				}

				const xPoint = i * horizDist;
				const valueHeight = height * (zero - val);
				const heights = Math.abs(valueHeight) < ratio ? zeroHeight : valueHeight; // so bar is at least 1px high

				if (i !== rowCounts - 1){ctx.fillRect(xPoint, yPoint, w/10, heights);}
				ctx.strokeStyle = 'green';
				ctx.lineWidth = 1;
				ctx.stroke();
				if (i !== 0){
					ctx.moveTo(prevX,prevY + prevH);
					ctx.lineTo(xPoint,yPoint+heights);
				}
				const prevX = xPoint;
				const prevY = yPoint;
				const prevH = heights;
			}
		}
	}

	render() {

		return <div className={this.props.className || ''}>
			<RemountOnResize>
				<CanvasEnhancer paint={this.paint}/>
			</RemountOnResize>
		</div>;
	}
};

const LineChartPanel = Def;
export default LineChartPanel;