import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './App';
import Login from './Login';
import Overview from './Overview';
import './index.css';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="overview" component={Overview}/>
    </Route>
  </Router>
), document.getElementById('root'))
