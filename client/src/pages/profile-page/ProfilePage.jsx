import React, { Component } from 'react';

/*
Material UI
*/


/*
Components
*/
//import PostDetail from '../../components/post-detail/PostDetail';

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