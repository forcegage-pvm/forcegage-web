import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// import React from "react";
// import { render } from "react-dom";
// import { Provider } from "react-redux";
// import store from "./store/index";
// import App from "./components/App"
// // if you're in create-react-app import the files as:
// // import store from "./js/store/index";
// // import App from "./js/components/App.jsx";
// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   // The target element might be either root or app,
//   // depending on your development environment
//   // document.getElementById("app")
//   document.getElementById("root")
// );
