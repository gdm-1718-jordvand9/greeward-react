import React, { Component } from 'react';

/*
Styles
*/
import './Card.css';

class Card extends Component {
  render() {
    return (
      <div className="col-10 offset-1 card-drop p-0">
      {this.props.children}
      </div>
    )
  }
}
export default Card;