import React, { Component } from 'react';
import Activity from '../../components/activity/Activity';

/* global google */
/*
Component styles
*/

class FeedPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: null,
    }
  }

  componentDidMount() {
    fetch('/api/v1/activities')
      .then(response => response.json())
      .then(item => this.setState({ activities: item }));
  }

  render() {
    if (this.state.activities) {
      console.log(this.state.activities);
      return (
        <div className="row">
          {this.state.activities.map((element, i) => (
            <Activity
              key={i}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%`, borderRadius: `10 px` }} />}
              mapElement={<div style={{ height: `100%`, borderRadius: `10 px` }} />}
              origin={new google.maps.LatLng(element.start_lat, element.start_lng)}
              destination={new google.maps.LatLng(element.stop_lat, element.stop_lng)}
              element = { element}
            />
          ))}
        </div>
      )
    } else {
      return ( 
        <div>
          No activities in your feed!
        </div>
      )
    }
  }
}

export default (FeedPage);