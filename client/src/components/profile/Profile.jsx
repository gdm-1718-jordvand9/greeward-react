import React, { Component } from 'react';

/*
Components
*/
import LoadingIndicator from '../loading-indicator/LoadingIndicator';
import { Link } from 'react-router-dom';
import Card from '../card/Card';
import Activity from '../activity/Activity';

/*
State management via Redux
*/
import { connect } from 'react-redux';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      followed: false,
      following: null,
      followers: undefined,
      loading: true,
    }
  }
  followButton() {
    if (this.props.authenticated) {
      if (this.state.followed) {
        return [
          <button className="btn--primary" onClick={this.unFollowUser.bind(this)}>Unfollow</button>
        ];
      }
      return [
        <button className="btn--primary" onClick={this.followUser.bind(this)}>Follow</button>
      ];
    }
  }
  followingButton() {
    if (this.state.following) {
      return [
        <Link to={`/following/${this.props.profileId}`}>
          <button className="btn--secondary mr-2 mb-2">{this.state.following.length} Following</button>
        </Link>
      ];
    }
  }
  fetchFollow() {
    console.log(this.props.profileId);
    fetch(`https://greeward.herokuapp.com/api/v1/following/${this.props.profileId}`)
      .then(response => response.json())
      .then(item => this.setState({ following: item._fid, loading: false }));
    fetch(`https://greeward.herokuapp.com/api/v1/followers/${this.props.profileId}`)
      .then(response => response.json())
      .then(item => {
        this.setState({ followers: item, loading: false })
        console.log(item);
        console.log(this.props.userId);
        const isFollowing = item.find((obj) => { return obj._uid._id === this.props.userId });
        console.log('isfollowing');
        console.log(isFollowing);
        if (isFollowing) this.setState({ followers: item, followed: true });
        if (!isFollowing) this.setState({ followers: item });
      });
  }
  componentDidMount() {
    fetch(`https://greeward.herokuapp.com/api/v1/profile/${this.props.profileId}`)
      .then(response => response.json())
      .then(item => this.setState({ profile: item }));
    this.fetchFollow();
    /* fetch(`https://greeward.herokuapp.com/api/v1/followers/${this.props.profileId}`)
      .then(response => {
        if (response.status !== 200) {
          throw new Error("Not 200 response")
        } else {
          response.json()
        }
      })
      .then(item => {
        console.log(item);
        const isFollowing = item.find((obj) => { return obj._uid._id === this.props.userId })
        if (isFollowing) {
          this.setState({ followers: item, followed: true });
        } else {
          this.setState({ followers: item });
        }
      }).catch(err => {
        this.setState({ followers: [] });
      }); */
    // if (this.props.authenticated && this.state.followers) {

    // }
  }
  followUser() {
    const followData = new Blob([JSON.stringify({ _fid: this.state.profile.id }, null, 2)], { type: 'application/json' });
    console.log(followData);
    const options = {
      method: 'POST',
      body: followData,
      mode: 'cors',
      cache: 'default',
      headers: { 'x-access-token': this.props.token }
    };
    fetch('https://greeward.herokuapp.com/api/v1/follow', options)
      .then(response => response.json())
      .then(item => {
        this.setState({ followers: item, followed: true })
        this.fetchFollow();
    });
  }
  unFollowUser() {
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      headers: { 'x-access-token': this.props.token }
    };
    fetch(`https://greeward.herokuapp.com/api/v1/unfollow/${this.props.profileId}`, options)
      .then(response => response.json())
      .then(item => {
        this.setState({ followed: false, followers: item })
        this.fetchFollow();
      });
  }
  render() {
    if (this.state.profile) {
      console.log(this.state.profile);
      return (
        <div>
          <Card>
            <div className="p-4 card__content">
              <div className="row ">
                <div className="col-3 col-sm-2">
                  <div className="img--round card__profile-picture " style={{ backgroundImage: `url(${this.state.profile.avatar})` }}>
                  </div>
                </div>
                <div className="col-9 col-sm-10 profile__name">
                  <h2 className="mt-1 mb-3">{this.state.profile.first_name + ' ' + this.state.profile.last_name}</h2>
                </div>
                <div className="col-12 col-lg-10 offset-lg-2 mt-lg-0 mt-3">
                  {this.followingButton()}
                  {this.state.followers && <Link to={`/followers/${this.props.profileId}`}><button className="btn--secondary mr-2 mb-2">{this.state.followers.length} followers</button></Link>}
                  {this.followButton()}
                </div>
              </div>
              <div className="row card__stats">
                <div className="offset-lg-2 col-4 col-sm-3  col-lg-2">
                  <p className="card__stat__type">Distance</p>
                  <p className="card__number">{parseFloat(this.state.profile.stats.km / 1000).toFixed(2)} <span className="unit">km</span></p>
                </div>
                <div className="col-4 col-sm-3 col-lg-2">
                  <p className="card__stat__type">Points</p>
                  <p className="card__number">{Math.round(this.state.profile.stats.pts)} <span className="unit">pts</span></p>
                </div>
                <div className="col-4 col-sm-4">
                  <p className="card__stat__type">Co2</p>
                  <p className="card__number">{parseFloat(this.state.profile.stats.km / 9).toFixed()} <span className="unit">gr</span></p>
                </div>
              </div>
            </div>
          </Card>
          {this.state.profile.activities.map((activity, i) => (
            <Activity activity={activity} key={i} />))}
        </div>

      )
    } else {
      return (
        <LoadingIndicator />
      )
    }

  }
}
const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    token: state.auth.authenticated ? state.auth.auth.token : null,
    userId: state.auth.authenticated ? state.auth.auth.user.id : null,
  };
};

export default connect(mapStateToProps)(Profile);