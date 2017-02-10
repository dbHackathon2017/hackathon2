import React, { Component } from 'react';
import { Link } from 'react-router';
import './Login.css';

class Login extends Component {
  render() {
    return (
      <div className="col-md-4 col-md-offset-4">
        <div className="panel">
          <form className="form-signin">
            <h2 className="form-signin-heading">Please sign in</h2>
            <label for="inputEmail" className="sr-only">Email address</label>
            <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
            <label for="inputPassword" className="sr-only">Password</label>
            <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
            <Link to='overview'>
              <button className="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
