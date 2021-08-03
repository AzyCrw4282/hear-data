/* global APP_TITLE */
import React from 'react';
import LoadError from './Loader';
import Shell from './Shell';


const Def = props =>
	<Shell title={APP_TITLE}>
		<LoadError {...props}/>
	</Shell>;

const LoadFailure = Def;
export default LoadFailure;