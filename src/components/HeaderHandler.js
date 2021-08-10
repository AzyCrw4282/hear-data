import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		backgroundColor: theme.palette.background.default
	},
	titleValue: {
		flex: 2
	},
	header: {
	},
	'@media (max-height: 445px)': {
		appBar: {
			minHeight: 50,
		}
	}
});

const Def = class BarComponents extends React.Component {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		theme: PropTypes.object.isRequired,
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]),
		title: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node,
			PropTypes.string
		]),
		header: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node,
			PropTypes.string
		])
	}

	render() {
		const {
			classes,
			header,
			children
		} = this.props;

        
        <Typography variant="h4" color="inherit" className={classes.titleValue} component="h1">
            {this.props.title}
        </Typography>;

		return <div className={classes.root}>
			<AppBar position="static">
				<Toolbar className={classes.header}>
					{this.props.title}
					{header}
				</Toolbar>
			</AppBar>
			{children}
			<footer className={classes.footer}></footer>
		</div>;
	}
};

const Shell = withStyles(styles, { withTheme: true })(Def);
export default Shell;