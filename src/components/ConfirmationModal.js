import React from 'react'; 
import { confirmable } from 'react-confirm';
import PropTypes from 'prop-types';
import Theme from './InterfaceTheme';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

const Def = class ConfirmModal extends React.Component {
	static propTypes = {
		showState: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
		proceedState: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
		cancelState: PropTypes.func,
		dismiss: PropTypes.func,
		confirmation: PropTypes.oneOfType([ // arguments of your confirm function
			PropTypes.string,
			PropTypes.node
		]).isRequired,
		options: PropTypes.object, // arguments of your confirm function

		classes: PropTypes.object
	}

	render() {
		const {
			classes,
			showState,
			proceedState,
			cancelState,
			confirmation,
			options
		} = this.props;

		const yes = options && options.yes || 'Yes';
		const no = options && options.no || 'No';

		return <Theme>
            <Dialog
			classes={classes}
			open={showState}
			onClose={cancelState}
			aria-labelledby="modal-title"
			aria-describedby="modal-desc"
		    >
			<DialogContent>
				<DialogContentText id="modal-desc">
					{confirmation}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={cancelState} color="red" >
					{no}
				</Button>
				<Button onClick={proceedState} color="Primary" autoFocus>
					{yes}
				</Button>
			</DialogActions>
		</Dialog></Theme>;
	}
};

const ConfirmModal = confirmable(Def);
export default ConfirmModal;