import React, { Component } from 'react';

/*
Components
*/
import ActivityDetail from '../../components/activity-detail/ActivityDetail';

class ActivityPage extends Component {

  render() {
      return (
        <div className="row">
          <ActivityDetail activityId={ this.props.match.params.id }/>
        </div>
      )
    }
  }

export default (ActivityPage);