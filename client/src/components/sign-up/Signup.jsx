import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Components
*/
import { Link } from 'react-router-dom';

/*
State management
*/
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signUpActionLocalStrategy } from '../../actions/authActions';
import Card from '../card/Card';
import FormInput from '../forminput/FormInput';
/*
Validation
*/
const validate = values => {
  const errors = {}
  const requiredFields = [
    'first_name',
    'last_name',
    'email',
    'password'
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
class Signup extends Component {
  submit = (values) => {
    this.props.signUp(values);
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

  componentWillReceiveProps(next) {
    if (next.signedup) {
      this.props.history.push('/signin');
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <Card>
        <div className="row p-4 sign-in">
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit(this.submit)} className="row">
              <div className="col-12">
                <Field name="first_name"
                  component={FormInput}
                  placeholder="First name"
                  fullWidth={true}
                />
              </div>
              <div className="col-12 mt-3">
                <Field name="last_name"
                  component={FormInput}
                  placeholder="Last name"
                  fullWidth={true}
                />
              </div>
              <div className="col-12 mt-3">
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
                <button className="btn--primary" type="submit">Sign up</button>
              </div>
            </form>
            <div className="row mt-2">
              <div className="col-12">
                {this.errorMessage()}
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-12 sign-up-message">
                <Link to="/signin">Already have an account ? Sign in!</Link>
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
    signedup: state.auth.signedup,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUp: (values, history) => dispatch(signUpActionLocalStrategy(values))
  };
};

const reduxFormSignUp = reduxForm({
  form: 'signUp',
  validate,
})(Signup);

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormSignUp);