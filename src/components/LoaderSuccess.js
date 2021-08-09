import React from 'react';
import Loader from './../extensions/LoaderFunction';
import Shell from './HeaderHandler';


const Def = () =>
	<Shell title={APP_TITLE}>
		<Loader/>
	</Shell>;

const AppLoader = Def;
export default AppLoader;