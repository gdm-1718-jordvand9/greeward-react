import React, { Component } from 'react';

/*
Component styles
*/
import './ProfilePage.css';
import Profile from '../../components/profile/Profile';
class ProfilePage extends Component {

  render() {
    return (
      <Profile profileId={ this.props.match.params.id }/>
    )
  }
}

export default (ProfilePage);