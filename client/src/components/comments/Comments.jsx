import React, { Component } from 'react';

/*
Libraries
*/
import * as moment from 'moment';

/*
Components
*/
import Card from '../card/Card';
import { Link } from 'react-router-dom';

/*
State management via Redux
*/
import { connect } from 'react-redux';
import { softDeleteActivityComment, createActivityComment, createActivityLike, removeActivityLike } from '../../actions/activityActions';
import { Field, reduxForm } from 'redux-form';

/*
Styles
*/
import './Comment.css'

const validate = values => {
  const errors = {}
  const requiredFields = [
    'body',
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  })
  return errors;
}

class Comments extends Component {

  handleSoftDelete(commentId) {
    this.props.softDeleteActivityComment(commentId);
  }

  submit = (values) => {
    this.props.createActivityComment({ body: values.body, activity: this.props.activityId });
  }

  handleLike() {
    this.props.createActivityLike(this.props.activityId);
  }

  handleUnLike() {
    this.props.removeActivityLike(this.props.activityId);
  }

  errorMessage() {
    if (this.props.error) {
      return (
        <div className="info-red">
          {this.props.error.message}
        </div>
      );
    }
  }

  renderField(field) {
    return (
      <div className="mb-3">
        <input type="text" placeholder="Add comment" className="col-12" {...field.input} autoComplete="off" />
        {field.meta.touched && field.meta.error &&
          <span className="pl-4">{field.meta.error}</span>}
      </div>
    )
  }

  render() {
    const { handleSubmit } = this.props;
    const likeButton = this.props.activity_liked ? (<button className="btn--primary ml-2" onClick={this.handleUnLike.bind(this)} type="button">UnLike</button>) : (<button className="btn--primary ml-2" onClick={this.handleLike.bind(this)} type="button">Like</button>);
    if (this.props.comments) {
      return (
        <div>
          <div className="row">
            <div className="col-10 offset-1">
              <h2>Comments</h2>
            </div>
          </div>
          {this.props.comments.map((comment, i) => (
            <Card key={i}>
              <div className="row pl-2 pr-2 pt-4 pb-3">
                <div className="col-3 col-md-2">
                  <Link to={`/profile/${comment._user.id}`} style={{ cursor: 'pointer' }}>
                    <div className="img--round comment__img" style={{ backgroundImage: `url(${comment._user.avatar})` }}></div>
                  </Link>
                </div>
                <div className="col-9">
                  <Link to={`/profile/${comment._user.id}`}>
                    <h5 className="mt-1 mb-0">{comment._user.first_name + ' ' + comment._user.last_name}</h5>
                  </Link>
                  <span className="comment__date">{moment(comment.created_at).fromNow()}</span>
                  <p className="mt-2">{comment.body}</p>
                  {comment._user._id === this.props.userId &&
                    <button onClick={() => this.handleSoftDelete(comment._id)} className="btn--primary">X</button>
                  }
                </div>
              </div>
            </Card>
          ))}
          {this.props.authenticated &&
            <Card >
              <form onSubmit={handleSubmit(this.submit)} className="col-12 comment--form p-4">
                <Field
                  name="body"
                  component={this.renderField}
                />
                {/* <button onClick={() => this.handleSubmit()} className="btn--primary">Add comment</button> */}
                <button type="submit" className="btn--primary">Add comment</button>
                {likeButton}
              </form>

              <div className="row">
                <div className="col-12">
                  {this.errorMessage()}
                </div>
              </div>
            </Card>
          }
        </div>
      )
    } else {
      return (
        <div>Niets!</div>
      )
    }

  }
}
const mapStateToProps = (state) => {
  return {
    commentCreationError: state.activity.error,
    commentDeleteError: state.activity.error,
    likeCreationError: state.activity.error,
    activity_liked: state.activity.activity_liked,
    authenticated: state.auth.authenticated,
    userId: state.auth.authenticated ? state.auth.auth.user.id : null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createActivityComment: (values) => dispatch(createActivityComment(values)),
    softDeleteActivityComment: (values) => dispatch(softDeleteActivityComment(values)),
    createActivityLike: (values) => dispatch(createActivityLike(values)),
    removeActivityLike: (values) => dispatch(removeActivityLike(values)),
  };
};

const reduxFormCommentForm = reduxForm({
  form: 'commentCreate',
  validate
})(Comments);

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormCommentForm);