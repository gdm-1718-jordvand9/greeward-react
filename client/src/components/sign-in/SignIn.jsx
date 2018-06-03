import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Components
*/
import { Link } from 'react-router-dom';
/*
Libraries
*/
import FacebookLogin from 'react-facebook-login';

/*
State management
*/
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signInActionFacebookStrategy, signInActionLocalStrategy } from '../../actions/authActions';

/*
Configuration
*/
import config from '../../config';
import Card from '../card/Card';
import FormInput from '../forminput/FormInput';

/*
Styles
*/
import './SignIn.css'

/*
Validation
*/
const validate = values => {
  const errors = {}
  const requiredFields = [
    'email',
    'password',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  })
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
  return errors;
}

class SignIn extends Component {
  submit = (values) => {
    this.props.signIn(values, this.props.history);
  }

  errorMessage() {
    if (this.props.authError) {
      return (
        <div className="error-message">
          {this.props.authError}
        </div>
      );
    }
  }

  facebookResponse = (response) => {
    this.props.signInFacebook(response.accessToken, this.props.history);
  };

  componentWillReceiveProps(next) {
    if(next.authenticated) {
      this.props.history.push('/activities');
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Card>
        <div className="row p-4 sign-in">
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit(this.submit)} className="row">
              <div className="col-12">
                <Field name="email"
                  component={FormInput}
                  placeholder="Email"
                  fullWidth={true}
                />
              </div>
              <div className="col-12 mt-3">
                <Field name="password"
                  component={FormInput}
                  type="password"
                  placeholder="Password"
                  fullWidth={true}
                />
              </div>
              <div className="col-12 mt-3">
                <button className="btn--primary" type="submit">Sign in</button>
              </div>
            </form>
            <div className="row mt-2">
              <div className="col-12">
                {this.errorMessage()}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12 sign-up-message">
                <Link to="/signup">No account yet ? Sign up!</Link>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12">
                <FacebookLogin
                  appId={config.FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={this.facebookResponse} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    authError: state.auth.error,
    authenticated: state.auth.authenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signIn: (values, history) => dispatch(signInActionLocalStrategy(values, history)),
    signInFacebook: (accessToken, history) => dispatch(signInActionFacebookStrategy(accessToken, history))
  };
};

const reduxFormSignIn = reduxForm({
  form: 'signIn',
  validate
})(SignIn);

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormSignIn);