import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDial from '@material-ui/lab/SpeedDial';
import AddIcon from '@material-ui/icons/Add';
import NoteIcon from '@material-ui/icons/NoteAdd';
import trackType from './PanelHandlers';


const nameType =  trackType['scale'].name;
const keyValue = ['scale'].map(key => ({
	key
}));


const styles = theme => ({
	root: {
		pointerEvents: 'none'
	}
});



const Def = class AddTrackButton extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		classes: PropTypes.object,
		onClick: PropTypes.func
	}

	static defaultProps = {
	}

	state = {
		open: false
	}

	handleOnHover = () => {
		this.setState({
			open: true
		});
	}

	handleOnClose = () => {
		this.setState({
			open: false
		});
	}

	handleClick = type => () => {
		if (this.props.onClick) {
			this.props.onClick(type);
		}
		this.setState(state => ({
			open: !state.open
		}));
	}

	render() {
		const {
			classes,
			className
		} = this.props;

		const { open } = this.state;

		return <div className={classNames(classes.root, className)}>
			<SpeedDial
				ariaLabel="Create new track"
				className={''}
				icon={<SpeedDialIcon openIcon={<AddIcon />} />}
				ButtonProps={{
					'data-tour-id': 'add-track'
				}}
				direction="up"
				onClose={this.handleOnClose}
				onMouseEnter={this.handleOnHover}
				onMouseLeave={this.handleOnClose}
				open={open}
			>
				<SpeedDialAction
					key={keyValue.key}
					icon={<NoteIcon/>}
					tooltipTitle={nameType}
					onClick={this.handleClick(keyValue.key)}
				/>
			</SpeedDial>
		</div>;
	}
};


const AddPanelButton = withStyles(styles)(Def);
export default AddPanelButton;






















//Alternative Btn- not used
/*
 <Button
    open={open}
    className={classes.button}				
    ariaLabel="Create new panel"
    data-tour-id="Add panels"
    variant="contained"
    onClick={this.handleClick}
    color = "primary"
    onBlur={this.handleClose}
    onClose={this.handleClose}
    onFocus={this.handleOpen}
    onMouseEnter={this.handleOpen}
    onMouseLeave={this.handleClose}
    open={open}				
>
    Add Panels
<AddIcon className={classes.rightIcon}/>

</Button>
*/