import React, { Component } from 'react';

/*
Libraries
*/
import queryString from 'query-string';

/*
Material UI
*/


/*
Components
*/
import PostForm from '../../components/post-form/PostForm';

/*
Component styles
*/
import './PostCreatePage.css';

class PostCreatePage extends Component {
  constructor(props) {
    super(props);

    const parsed = queryString.parse(this.props.location.search);
    const id = parsed.id;

    this.state = {
      boSelectedPostId:  id
    }
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-12 col-md-8 offset-md-2 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3">
              <PostForm postId={ this.state.boSelectedPostId } />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default (PostCreatePage);