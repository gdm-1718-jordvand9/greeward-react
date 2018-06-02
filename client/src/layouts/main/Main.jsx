
import React, { Component } from 'react';

/*
Libraries
*/
import { Redirect, Route, Switch } from 'react-router-dom';

/*
Material UI
*/
import './Main.css';

/*
Components
*/
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';

/*
Page components
*/
import HomePage from '../../pages/home-page/HomePage';
import NotFoundPage from '../../pages/not-found-page/NotFoundPage';
import PostPage from '../../pages/post-page/PostPage';
import PostsPage from '../../pages/posts-page/PostsPage';
import SignInPage from '../../pages/sign-in-page/SignInPage';
import SignOutPage from '../../pages/sign-out-page/SignOutPage';
import SignupPage from '../../pages/signup-page/SignupPage';

import FeedPage from '../../pages/feed-page/FeedPage';
import ProfilePage from '../../pages/profile-page/ProfilePage';

import PostCreatePage from '../../pages/post-create-page/PostCreatePage';
import PostsTablePage from '../../pages/posts-table-page/PostsTablePage';
import Nav from '../../components/nav/Nav';
import ActivityPage from '../../pages/acitivity-page/ActivityPage';
import Footer from '../../components/footer/Footer';
import ActivitiesList from '../../components/activities-list/ActivitiesList';
import FollowersPage from '../../pages/followers-page/FollowersPage';
import FollowingPage from '../../pages/following-page/FollowingPage';
import ActivitiesTablePage from '../../pages/activities-table-page/ActivitiesTablePage';
import CommentsTablePage from '../../pages/comments-table-page/CommentsTablePage';
import BackofficePage from '../../pages/backoffice-page/BackofficePage';
import ProfilesTablePage from '../../pages/profiles-table-page/ProfilesTablePage';
import ActivityOverviewPage from '../../pages/activity-overview-page/ActivityOverviewPage';
import ProfileOverviewPage from '../../pages/profile-overview-page/ProfileOverviewPage';
import CommentOverviewPage from '../../pages/comment-overview-page/CommentOverviewPage';




class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }
  generateRandomRoute() {
    var center = {lat: 51.05, lng: 3.7167};
    var radius = 1000;
    var x0 = center.lng;
    var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  
  console.log({'lat': y+y0, 'lng': xp+x0});
  return {'lat': y+y0, 'lng': xp+x0};
  }
  
  render() {
    
    return (
      <div className="container-fluid">
        <Header />
        <div className="row container__content">
          <Nav />
          <div className="col-12 col-md-10 col-lg-8 color--background">
            <Switch>
              <Route exact path='/' component={HomePage} />
              <Redirect from="/home" to="/" />
              <Route exact path='/posts' component={PostsPage} />
              <Route exact path='/followers/:id' component={FollowersPage} />
              <Route exact path='/following/:id' component={FollowingPage} />
              <Route exact path='/profile/:id' component={ProfilePage} />
              <Route exact path='/feed' component={FeedPage} />
              <Route exact path='/activities' component={ActivitiesList} />
              <Route exact path='/activity/:id' component={ActivityPage} />
              <Route path='/posts/:id' component={PostPage} />
              <Route path='/signin' component={SignInPage} />
              <Route path='/signout' component={SignOutPage} />
              <Route path='/signup' component={SignupPage} />
              <Route exact path='/backoffice' component={BackofficePage}/>
              <Route path='/backoffice/posts-table' component={PostsTablePage} />
              <Route path='/backoffice/activities-table' component={ActivitiesTablePage}/>
              <Route path='/backoffice/comments-table' component={CommentsTablePage}/>
              <Route path='/backoffice/profiles-table' component={ProfilesTablePage}/>
              <Route path='/backoffice/activity-overview/:id' component={ActivityOverviewPage}/>
              <Route path='/backoffice/profile-overview/:id' component={ProfileOverviewPage}/>
              <Route path='/backoffice/comment-overview/:id' component={CommentOverviewPage}/>
              <Route path='/backoffice/post-create' component={PostCreatePage} />
              <Route path="*" component={NotFoundPage} />
            </Switch>
          </div>
          <Sidebar />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Main;
