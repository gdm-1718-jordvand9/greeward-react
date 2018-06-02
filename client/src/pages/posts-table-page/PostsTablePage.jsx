import React, { Component } from 'react';

/*
Libraries
*/


/*
Material UI
*/


/*
Components
*/
import PostsTable from '../../components/posts-table/PostsTable';

/*
Component styles
*/
import './PostsTablePage.css';

class PostsTablePage extends Component {
  render() {
    return (
      <PostsTable />
    )
  }
}

export default (PostsTablePage);