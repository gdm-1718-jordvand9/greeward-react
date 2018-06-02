import React, { Component } from 'react';
import Following from '../../components/following/Following';

class FollowingPage extends Component {

  render() {
    return (
      <Following userId={this.props.match.params.id} />
    )
  }
}

export default FollowingPage;