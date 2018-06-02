import React, { Component } from 'react';
import ActivityOverview from '../../components/activity-overview/ActivityOverview';

class ActivityOverviewPage extends Component {
  render() {
    return (
      <ActivityOverview activityId={this.props.match.params.id}/>
    );
  }
}

export default ActivityOverviewPage;