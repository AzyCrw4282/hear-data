import React from 'react';
import PropTypes from 'prop-types';
import Theme from './Theme';
import Loader from './LoaderSuccess';
import LoadFailure from './Loader';
import asyncComponent from './AsyncHandler';
import { loadSpecs } from './LoadDepsRequirements';

//loads the requirements as apps using the StoreHandler module

const StoreApp = asyncComponent(
	() => loadSpecs().then(({StoreApp}) => StoreApp),
	{
		load: Loader,
		fail: LoadFailure
	}
);

const Def = class Main extends React.Component {
	componentDidCatch(error) {
		if (this.props.onError) {
			this.props.onError(error);
		}
	}

	render() {
		return <Theme>

            <StoreApp {...this.props}/>
			
        </Theme>;
	}
};

Def.propTypes = {
	onError: PropTypes.func
};

const Main = Def;
export default Main;