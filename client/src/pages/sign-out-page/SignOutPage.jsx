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
      <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              SIGN OUT
            </div>
          </div>
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