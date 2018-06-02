import React, { Component } from 'react';
import ProfileOverview from '../../components/profile-overview/ProfileOverview';

class ProfileOverviewPage extends Component {
  render() {
    return (
      <ProfileOverview profileId={this.props.match.params.id}/>
    );
  }
}

export default ProfileOverviewPage;