import React from 'react';
import { store } from '../store';
import { Provider } from 'unistore/react';

import App from './AppComponents';

const Def = props =>
	<Provider store={store}>
		<App {...props}/>
	</Provider>;

const StoreHandler = Def;
export default StoreHandler;
