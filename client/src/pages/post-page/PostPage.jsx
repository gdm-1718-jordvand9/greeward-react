import React, { Component } from 'react';

/*
Material UI
*/


/*
Components
*/
import PostDetail from '../../components/post-detail/PostDetail';

/*
Component styles
*/
import './PostPage.css';

class PostPage extends Component {

  render() {
    return (
      <div>
        <div className="c-max">
              <PostDetail postId={ this.props.match.params.id }/>
        </div>
      </div>
    )
  }
}

export default (PostPage);