import React, { Component } from 'react';

/*
Components
*/
import { Link } from 'react-router-dom';

/*
State management via redux
*/
import { connect } from 'react-redux';
import { createActivity } from '../../actions/activityActions';


/*
Styles
*/
import './Sidebar.scss';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  };

  submit = () => {
    this.props.createActivity();
  }

  createActivity = () => {
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      headers: { 'x-access-token': this.props.token }
    };
    fetch('https://greeward.herokuapp.com/api/v1/activity', options).then((res) => console.log(res)).catch((err) => console.log(err));
  }
  render() {
    if (this.props.user) {
      const { user } = this.props
      return (
        <div className="col-lg-3 sidebar__profile">
          <div className="row">
            <div className="col-12">
              <div className="img" style={{ backgroundImage: `url(${user.avatar})` }}></div>
            </div>
            <div className="col-12">
              <h3>{user.first_name + ' ' + user.last_name} </h3>
            </div>
            <div className="col-4 stat">
              <p>{parseFloat(user.stats.km / 1000).toFixed(2)}</p>
              <p>KM</p>
            </div>
            <div className="col-4 stat">
              <p>{(user.stats.pts).toFixed()}</p>
              <p>points</p>
            </div>
            <div className="col-4 stat">
              <p>{(user.stats.km / 9).toFixed()}</p>
              <p>Co2</p>
            </div>
            <div className="col-12">
              <button className="btn--primary" onClick={this.submit}>Add ride</button>
            </div>
            <div className="col-12 mt-2 mb-2">
            <Link to="/signout">
              <button className="btn--primary">Sign out</button>
            </Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="col-lg-3 pt-3 d-flex justify-content-center">
          <Link to="/signin" className="mr-2"><button className="btn--primary">Sign in</button></Link>
          <Link to="/signup"><button className="btn--primary">Sign up</button></Link>
        </div>
      );
    }

  }
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    user: state.auth.authenticated ? state.auth.auth.user : null,
    token: state.auth.authenticated ? state.auth.auth.token : null,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    createActivity: (values) => dispatch(createActivity()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
