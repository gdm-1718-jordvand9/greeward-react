import React, { Component } from "react";
/* 
Components
*/
import LoadingIndicator from "../loading-indicator/LoadingIndicator";
import { Link } from 'react-router-dom';
import Card from "../card/Card";

/* 
Styles
*/
import './Following.css';

class Following extends Component {
  constructor(props) {
    super(props)
    this.state = {
      following: null,
      loading: true,
    }
  }

  componentDidMount() {
    fetch(`https://greeward.herokuapp.com/api/v1/following/${this.props.userId}`)
      .then(response => response.json())
      .then(item => this.setState({ following: item._fid, loading: false }));
  }
  
  render() {
    if (this.state.following) {
      console.log(this.state.following);
      return (
        <div className="following">
          <div className="row">
            <div className="col-10 offset-1">
              <h1>{this.state.following.length} following</h1>
            </div>
          </div>
          {this.state.following.map((following, i) => (
            <Link to={`/profile/${following.id}`} style={{ textDecoration: 'none' }} key={i}>
              <Card  >
                <div className="row p-3">
                  <div className="col-2">
                    <div className="card__profile-picture img--round" style={{ backgroundImage: `url(${following.avatar})` }}>
                    </div>
                  </div>
                  <div className="col-10">
                    <h3>{following.first_name + ' ' + following.last_name}</h3>
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
export default Following