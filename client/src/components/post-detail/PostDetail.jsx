import React, { Component } from 'react';

/*
Material UI
*/

class PostDetail extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      post: undefined
    }
  }

  componentDidMount() {
    fetch(`https://greeward.herokuapp.com/api/v1/posts/${this.props.postId}`)
      .then( response => response.json())
      .then( item => this.setState({ post: item })); 
  }

  render() {
    if(this.state.post) {
      return (
        <div>
          POST
        </div>
      );
    } else {
      return (
        <div>
          Loading
        </div>
      )
    }   
  }
}

export default PostDetail;