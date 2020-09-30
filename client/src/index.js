import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/main.css'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

// redux 
import {Provider} from 'react-redux'
import store from './data/store'

// component 
import Navbar from './components/navbar/navbar.component';
import Register from './screens/Register';



ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
    <Navbar />
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/register' component={Register} />
      </Switch>
    </BrowserRouter>
    <App />
  </Provider>,
  document.getElementById('root')
);

