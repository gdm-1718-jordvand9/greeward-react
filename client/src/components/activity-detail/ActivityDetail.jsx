import React, { Component } from 'react';

/*
State management via Redux
*/
import { connect } from 'react-redux';
import { fetchActivity } from '../../actions/activityActions';

/*
Components
*/
import Comments from '../comments/Comments';
import Activity from '../activity/Activity';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

/*
Styles
*/
import './ActivityDetail.css'

class ActivityDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activity: this.props.activity.activity,
      comments: [],
    }
  }
  
  componentDidMount() {
    // Fetch activity
    this.props.fetchActivity(this.props.activityId);
  }

  render() {
    if (this.props.activity.activity) {
      return (
        <div className="activity">
          <Activity activity={this.props.activity.activity} />
          <Comments activityId={this.props.activityId} comments={this.props.activity.activity.comments} />
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
    activityFetchingError: state.activity.error,
    activity: state.activity,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchActivity: (values) => dispatch(fetchActivity(values)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDetail);