import React, { Component } from 'react';

/*
Libraries
*/


/*
Material UI
*/


/*
Components
*/
import SignIn from '../../components/sign-in/SignIn';

/*
Component styles
*/
import './SignInPage.css';

class SignInPage extends Component {
  render() {
    return (
      <SignIn history={this.props.history}/>
    )
  }
}

export default (SignInPage);