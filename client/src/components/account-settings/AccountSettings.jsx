import React, { Component } from 'react';

/*
Component
*/
import Card from '../card/Card';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

/*
Libraries
*/
import * as moment from 'moment';

/*
State management
*/
import { Field, reduxForm } from 'redux-form';
import { updateAccountSettings } from '../../actions/profileActions';
import { connect } from 'react-redux';
import FormInput from '../forminput/FormInput';


class AccountSettings extends Component {
  constructor() {
    super()
    this.state = {
      account: undefined,
      first_name: null,
      last_name: null,
      avatar: null,
    }
  }
  componentDidMount() {
    this.loadProfile();
  }

  submit = (values) => {
    this.props.updateAccountSettings(values);
  }
  softDeleteActivity(activityId) {
    const options = {
      method: 'PATCH'
    }
    fetch(`https://greeward.herokuapp.com/api/v1/activities/${activityId}/softdelete`, options)
    .then(response => response.json())
    .then(item => {this.loadProfile()})
  }

  loadProfile() {
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      headers: { 'x-access-token': this.props.token }
    };
    fetch('https://greeward.herokuapp.com/api/v1/account', options)
      .then(response => response.json())
      .then(item => {
        this.setState({ account: item })
        this.props.initialize({ first_name: item.first_name, last_name: item.last_name, avatar: item.avatar });
      });
  }

  getActivitiesAsJSX() {
    let containerElement = '';
    if (this.state.account) {
      containerElement = this.state.account.activities.map((activity, index) => (
        <div className="col-12 mt-3">
          {moment(activity.created_at).format('DD/MM/YYYY - hh:mm') + ' - ' + (activity.distance / 1000).toFixed(2) + 'km'}
          <br />
          <button className="btn--primary mt-1" onClick={() => this.softDeleteActivity(activity._id)}>Delete</button>
        </div>

      ));
    }
    return containerElement;
  }
  render() {
    if (this.state.account && this.props.authenticated) {
      const { handleSubmit } = this.props;
      const { account } = this.state;
      return (
        <div>
          <Card>
            <div className="row p-4">
              <div className="col-12">
                <h2>Account settings</h2>
                <form className="row" onSubmit={handleSubmit(this.submit)}>
                  <div className="col-12">
                    <h3>First name</h3>
                    <Field name="first_name"
                      component={FormInput}
                      placeholder="First_name"
                      fullWidth={true}
                    />
                  </div>
                  <div className="col-12">
                    <h3>Last name</h3>
                    <Field name="last_name"
                      component={FormInput}
                      placeholder="Last_name"
                      fullWidth={true}
                      value={account.last_name}
                    />
                  </div>
                  <div className="col-12">
                    <h3>Avatar</h3>
                    <Field name="avatar"
                      component={FormInput}
                      placeholder="Avatar"
                      fullWidth={true}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <button className="btn--primary" type="submit">Save settings</button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
          <Card>
            <div className="row p-4">
              <div className="col-12">
                <h2>Activities</h2>
              </div>
              {this.getActivitiesAsJSX()}
            </div>
          </Card>
        </div>
      );
    } else {
      return (
        <LoadingIndicator />
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    token: state.auth.authenticated ? state.auth.auth.token : null,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateAccountSettings: (values) => dispatch(updateAccountSettings(values))
  };
};

const reduxFormAccountSettings = reduxForm({
  form: 'accountSettings',
})(AccountSettings);

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormAccountSettings);