import React, { Component } from 'react';

/*
Components
*/
import Card from '../card/Card';
import { Link } from 'react-router-dom';
import Map from '../../components/map/Map';

/*
Libraries
*/
import * as moment from 'moment';

/*
Styles
*/
import './Activity.css';

class Activity extends Component {
  
  render() {
    const activity = this.props.activity;
    return (
      <Card>
        <Map
          origin={{ lat: activity.start_lat, lng: activity.start_lng }}
          destination={{ lat: activity.stop_lat, lng: activity.stop_lng }}
        />
        <Link to={`/activity/${activity._id}`} style={{ textDecoration: 'none', cursor: 'pointer'}}>
          <div className="card__content pt-3 pb-3">
            <div className="row">
              <div className="col-3 col-sm-2 no-padding">
                <Link to={`/profile/${activity._user.id}`} style={{ cursor: 'pointer' }}>
                  <div className="card__profile-picture img--round" style={{ backgroundImage: `url(${activity._user.avatar})` }}>
                  </div>
                </Link>
              </div>
              <div className="col-9 col-sm-10">
                <h2 className="mb-0 mt-1">{activity._user.first_name + ' ' + activity._user.last_name}</h2>
                <p className="card__date">{moment(activity.created_at).fromNow()}</p>
              </div>
            </div>
            <div className="row card__stats mt-1">
              <div className="offset-sm-2 col-4 col-sm-3  col-lg-2">
                <p className="card__stat__type">Distance</p>
                <p className="card__number">{parseFloat(activity.distance / 1000).toFixed(1)} <span className="unit">km</span></p>
              </div>
              <div className="col-4 col-sm-3 col-lg-2">
                <p className="card__stat__type">Points</p>
                <p className="card__number">{Math.round(activity.points)} <span className="unit">pts</span></p>
              </div>
              <div className="col-4 col-sm-4">
                <p className="card__stat__type">Co2</p>
                <p className="card__number">{parseFloat(activity.distance / 9 ).toFixed(2)} <span className="unit">gram</span></p>
              </div>
            </div>
            <div className="row">
              <div className="col-12 offset-sm-2">
                <i className="fas fa-comment"></i> {activity.comments.length}
                <i className="fas fa-heart ml-2"></i> {activity.likes.length}
              </div>
              
            </div>
          </div>
        </Link>
      </Card>
    )
  }
}
export default Activity