import React, { Component } from 'react';
import Followers from '../../components/followers/Followers';

class FollowersPage extends Component {

  render() {
    return (
      <Followers userId={this.props.match.params.id} />
    )
  }
}

export default FollowersPage;