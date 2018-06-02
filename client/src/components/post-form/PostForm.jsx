import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Libraries
*/
import { Field, reduxForm } from 'redux-form';

/*
State management
*/
import { connect } from 'react-redux';
import { createPost } from '../../actions/postActions';

/*
Material UI
*/
import { MenuItem } from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {
  Select,
  TextField,
} from 'redux-form-material-ui'

/*
Styles
*/
import './PostForm.css';

/*
Validation
*/
const validate = values => {
  const errors = {}
  const requiredFields = [
    'title',
    'synopsis'
  ]
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  })
  return errors;
}


class PostForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: undefined
    }
  }

  submit = (values) => {
    this.props.createPost(values, this.props.history);
  }

  componentDidMount = () => {
    this.fetchPostCreateGet();
  }

  fetchPostCreateGet = () => {
    fetch('https://greeward.herokuapp.com/api/v1/posts/vm/create', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(results =>
      this.setState( {
        categories: results.categories
      })
    );
  }

  fetchPostUpdateGet = () => {
    fetch('https://greeward.herokuapp.com/api/v1/post', {
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    })
    .then(res => res.json())
    .then(post =>
      this.setState( {
        categories: post.categories
      })
    );
  }

  getCategoriesAsJSX = () => {
    let categoryElements = '';
    if(this.state.categories) {
      categoryElements = this.state.categories.map(
        (element) => {
          return (
            <MenuItem value={ element._id } key={ element._id }>{ element.name }</MenuItem>
          );
        }
      )
    };
    return categoryElements;
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
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col-12">
          <form onSubmit={ handleSubmit(this.submit) } className="row">
            <div className="col-12">
              <Field name="title"
                component={TextField}
                placeholder="Title" 
                fullWidth={true}
              />
            </div>
            <div className="col-12">
              <Field name="synopsis" 
                      component={TextField}
                      placeholder="Synopsis"
                      fullWidth={true}
                      multiline={true}
                      rows={2}
                      rowsMax={4}
              />
            </div>
            <div className="col-12">
              <Field name="body" 
                      component={TextField}
                      type="text"
                      placeholder="Body"
                      fullWidth={true}
                      multiline={true}
                      rows={8}
                      rowsMax={24}
              />
            </div>
            <div className="col-12">
              <Field name="category" component={Select} placeholder="Select a category">
                { this.getCategoriesAsJSX() }
              </Field>
            </div>
            <div className="col-12">
              <Button type="submit" variant="raised" color="primary" fullWidth={true}>
                Add post
              </Button>
            </div>
          </form>
          <div className="row">
            <div className="col-12">
              {this.errorMessage()}
            </div>
          </div>
        </div>
      </div>
    );     
  }
}

PostForm.propTypes = {
  postCreationError: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    postCreationError: state.post.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    createPost: (values, history) => dispatch(createPost(values, history)),
  };
};

const reduxFormPostForm = reduxForm({
  form: 'postCreate',
  validate
})(PostForm);

export default connect(mapStateToProps, mapDispatchToProps)(reduxFormPostForm);