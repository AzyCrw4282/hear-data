import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportError from './store/reportError'
import Main from './components/MainComposer';
// import reportWebVitals from './reportWebVitals';

console.log(`${APP_TITLE}. Test message output.`);
const rootEl = document.getElementById('root'); //root element Definition

let render = () => {};

if (module.hot) {
	const { AppContainer } = require('react-hot-loader');
	render = () => {
		ReactDOM.render(<AppContainer><Main onError={reportError}/></AppContainer>, rootEl);
	};

	render();
	module.hot.accept('./components/MainComposer', render);
} else {
	render = () => {
		ReactDOM.render(<Main onError={reportError}/>, rootEl);
	};
	console.log("Error loading the App. ")
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
