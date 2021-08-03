import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportError from './store/reportError'
import Main from './components/MainComposer';
import reportWebVitals from './reportWebVitals';

console.log(`${APP_TITLE}. Test message printed.`);

if (module.hot) {
	const { AppContainer } = require('react-hot-loader');
	render = () => {
		ReactDOM.render(<AppContainer><Main  onError={reportError}/></AppContainer>, rootEl);
	};

	render();
	module.hot.accept('./components/MainComposer', render);
} else {
	render = () => {
		ReactDOM.render(<Main  onError={reportError}/>, rootEl);
	};
	render();
}


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
