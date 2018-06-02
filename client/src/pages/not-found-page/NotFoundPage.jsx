import React, { Component } from 'react';

/*
Component styles
*/
import './NotFoundPage.css';

class NotFoundPage extends Component {

  render() {
    return (
      <div className="text-center" >
        <h1 style={{fontSize: '10rem'}} className="mb-0">404</h1>
        <p className="mt-0" style={{fontSize: '2rem'}}>Not found</p>
      </div>
    )
  }
}

export default (NotFoundPage);