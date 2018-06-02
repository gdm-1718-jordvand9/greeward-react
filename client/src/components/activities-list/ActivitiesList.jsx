import React, { Component } from 'react';

/*
Components
*/
import Activity from '../activity/Activity';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

/*
Styles
*/
import './ActivitiesList.css';

class ActivitiesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activities: null,
      loading: true,
    }
  }

  componentDidMount() {
    fetch('https://greeward.herokuapp.com/api/v1/activities')
      .then(response => response.json())
      .then(item => this.setState({ activities: item, loading: false }));
  }

  render() {
    if (this.state.activities) {
      console.log(this.state.activities);
      return (
        this.state.activities.map((activity, i) => (
          <Activity activity={activity} key={i} />
        ))
      )
    } else {
      return (
        <LoadingIndicator />
      )
    }
  }
}
export default ActivitiesList;