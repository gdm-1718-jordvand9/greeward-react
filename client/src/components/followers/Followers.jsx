import React, { Component } from "react";

/* 
Components
*/
import LoadingIndicator from "../loading-indicator/LoadingIndicator";
import Card from "../card/Card";
import { Link } from 'react-router-dom';

/* 
Styles
*/
import './Followers.css';

class Followers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      followers: null,
      loading: true,
    }
  }

  componentDidMount() {
    fetch(`/api/v1/followers/${this.props.userId}`)
      .then(response => response.json())
      .then(item => this.setState({ followers: item, loading: false }));
  }
  
  render() {
    if (this.state.followers) {
      return (
        <div className="followers">
          <div className="row">
            <div className="col-10 offset-1">
              <h1>{this.state.followers.length} followers</h1>
            </div>
          </div>
          {this.state.followers.map((follower, i) => (
            <Link to={`/profile/${follower._uid.id}`} style={{ textDecoration: 'none' }} key={i}>
              <Card  >
                <div className="row p-3">
                  <div className="col-2">
                    <div className="card__profile-picture img--round" style={{ backgroundImage: `url(${follower._uid.avatar})` }}>
                    </div>
                  </div>
                  <div className="col-10">
                    <h3>{follower._uid.first_name + ' ' + follower._uid.last_name}</h3>
                  </div>
                </div>
              </Card>
            </Link>))}
        </div>
      )
    }
    else {
      return (
        <LoadingIndicator />
      )
    }
  }
}
export default Followers