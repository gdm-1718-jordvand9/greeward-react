import React, { Component } from 'react';

/*
Material UI
*/


/*
Components
*/
import PostsList from '../../components/posts-list/PostsList';

/*
Component styles
*/
import './PostsPage.css';

class PostsPage extends Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <PostsList />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (PostsPage);