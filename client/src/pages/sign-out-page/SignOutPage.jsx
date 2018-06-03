import React, { Component } from 'react';

/*
State management
*/
import { connect } from 'react-redux';
import { signOutAction } from '../../actions/authActions';

/*
Material UI
*/


/*
Components
*/

/*
Component styles
*/
import './SignOutPage.css';

class SignOutPage extends Component {
  componentDidMount() {
    this.props.signOut();
  }
  render() {
    return (
      <div className="row">
        <div className="col-12 mt-2">
          <h2>Succesfully signed out.</h2>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOutAction())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignOutPage);