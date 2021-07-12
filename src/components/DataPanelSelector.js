// This handles the component interaction with the data
// which consequently changes the movement in that charts

//maps to the DataTable onclick panel

import React from 'react';
import classNames from 'classnames';
import { connect } from 'unistore/react';
import { actions } from '../store';
import formatData from '../util/formatData';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import MuiTable from 'mui-virtualized-table';

const styles = theme => ({
	root: {
		height: 'calc(100vh)',

		// table header
		'& .topRightGrid': {
			backgroundColor: theme.palette.background.default
		},
		'& .bottomLeftGrid': {
			backgroundColor: theme.palette.background.paper
		}
	},
	cell: {
		boxSizing: 'border-box',
		borderBottomColor: theme.palette.divider,

		'&.selected': {
			backgroundColor: theme.palette.action.selected
		}
	}
});

function formatData(field) {
	if (!field) {
		return identity;
	}

	if (field.type === 'int') {
		if (field.min >= 1000 && field.max < 3000) {
			// probably a year
			return identity;
		}
		return number;
	}

	if (field.type === 'float') {
		const rangeMax = Math.max(Math.abs(field.min), field.max);
		return rangeMax > 1e10 || rangeMax < 0.01 ?
			exponential : // todo: millions, billions, trillions?
			number;
	}

	if (field.type === 'boolean') {
		return boolean;
	}

	if (field.type === 'datetime') {
		// check stored timezone against current timezone and adjust
		if (field.showDate && !field.showTime) {
			return date;
		}

		if (field.showTime && !field.showDate) {
			return time;
		}

		const min = new Date(field.min);
		const max = new Date(field.max);
		const range = max - min;

		return range < 24 * 60 * 60 * 1000 ?
			time :
			datetime;
	}
	return identity;
}

const Def = class DataPanel extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		data: PropTypes.object,
        currentRowID: PropTypes.number,
		setCurrentRow: PropTypes.func.isRequired

	}

    onCellTrigger = (column, data) => {
        const index = data[0];
        this.props.setCurrentRow(index);
    }
    
	render() {
		const {
			classes,
			currentRowID
		} = this.props;

        const columnLabels = this.props.data.fields.map((field, iCount)=>{
            const parsedData = formatData(field);
            const index = iCount+1;
			return {
				name: index,
				header: field.name,
				minWidth: 180,
				cell(row) {
					const val = row[index];
					return parsedData(val);
				}
			};
        });
		const cellValues = this.props.data.rows.map((row, i) => [
			i,
			...row
		]);

		const selectedRow = cellValues[currentRowID];

		return <div className={classes.root}>
			<AutoSizer>
				{({ width, height }) =>
					<MuiTable
						data={cellValues}
						columns={columnLabels}
						width={width}
						maxHeight={height}
						rowHeight={25}
						includeHeaders={true}
						fixedRowCount={1}
						fixedColumnCount={1}
						onCellClick={this.onCellTrigger}
						ref={null && this.getTableRef}
						cellProps={(cellInfo, row) => ({
							className: classNames({
								selected: selectedRow === row,
								[classes.cell]: true,
								[classes.hidden]: cellInfo.name === -1
							})
						})}
					/>
				}
			</AutoSizer>
		</div>;
    }
}
const DataTable = withStyles(styles)(
	connect(['currentRow'], actions)(Def)
);
export default DataTable;