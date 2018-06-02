import React, { Component } from 'react';

/*
Libraries
*/
import { Link } from 'react-router-dom';

/*
Styles
*/
import './Headers.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  render() {
    return (
      <div className="row header">
        <div className="col-3 col-sm-2 col-lg-1 header--left">
          <div className="header__logo d-flex align-items-center justify-content-center">
            <i className="fab fa-envira"></i>
          </div>
        </div>
        <div className="col-9 col-sm-10 col-lg-11 header--right">
          <div className="row d-flex justify-content-center align-items-center header--input header__toolbar">
            <div className="col-11">
              <input type="text" placeholder="Search" />
            </div>
            <div className="col-1 ">
              <Link to="/signout">
              <i className="fas fa-compress"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Header;
