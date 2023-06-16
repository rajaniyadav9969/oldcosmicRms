import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { RMSStore } from './Components/Redux';
import { BrowserRouter } from 'react-router-dom';
import './DarkTheme.scss'

ReactDOM.render(
  <BrowserRouter>
    <Provider store={RMSStore}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);
reportWebVitals();
