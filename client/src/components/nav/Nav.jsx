import React, { Component } from 'react';

/*
Libraries
*/
import { Link } from 'react-router-dom';
import './Nav.css';

class Nav extends Component {
  render() {
    return (
      <div className="col-12 col-md-2 col-lg-1 nav">
        <div className="row">
          <div className="col-3 col-md-12 sidebar__icon align-items-center justify-content-center">
            <Link to="/activities"><i className="far fa-compass"></i></Link>
          </div>
          <div className="col-3 col-md-12 sidebar__icon align-items-center justify-content-center">
            <Link to="/friends"><i className="fas fa-user-friends"></i></Link>
          </div>
          <div className="col-3 col-md-12 sidebar__icon sidebar__icon--active align-items-center justify-content-center">
            <Link to="/friends"><i className="fas fa-user-circle"></i></Link>
          </div>
          <div className="col-3 col-md-12 sidebar__icon align-items-center justify-content-center">
            <a href=""><i className="fas fa-cog"></i></a>
          </div>
        </div>
      </div>
    )
  }
}
export default Nav;