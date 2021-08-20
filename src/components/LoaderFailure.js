/* global APP_TITLE */
/*
* Loader
* Credit: Azky & Library code
*/
import React from 'react';
import LoadError from './Loader';
import Shell from './Shell';


const Def = props =>
	<Shell title={APP_TITLE}>
		<LoadError {...props}/>
	</Shell>;

const LoadFailure = Def;
export default LoadFailure;