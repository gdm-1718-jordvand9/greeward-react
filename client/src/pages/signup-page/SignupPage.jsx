import React, { Component } from 'react';

/*
Material UI
*/


/*
Components
*/

/*
Component styles
*/
import './SignupPage.css';
import Signup from '../../components/sign-up/Signup';

class SignupPage extends Component {

  render() {
    return (
      <Signup history={this.props.history}/>
    )
  }
}

export default (SignupPage);