import React, { Component } from 'react';
import CommentOverview from '../../components/comment-overview/CommentOverview';

class CommentOverviewPage extends Component {
  render() {
    return (
      <CommentOverview commentId={this.props.match.params.id}/>
    );
  }
}

export default CommentOverviewPage;