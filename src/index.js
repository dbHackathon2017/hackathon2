import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './App';
import Login from './Login';
import Overview from './Overview';
import PensionDetail from './PensionDetail';
import './index.css';
import './reset.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="overview" component={Overview}/>
      <Route path="pension/:pensionId" component={PensionDetail}/>
    </Route>
  </Router>
), document.getElementById('root'))
