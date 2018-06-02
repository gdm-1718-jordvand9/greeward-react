import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Libraries
*/
import { Link } from 'react-router-dom';
import Enum from "es6-enum";

/*
Material UI
*/
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import IconCreate from '@material-ui/icons/Create';
import IconDelete from '@material-ui/icons/Delete';
import IconDeleteForever from '@material-ui/icons/DeleteForever';

const POSTACTIONSENUM = Enum('DELETE', 'SOFTDELETE', 'SOFTUNDELETE');

/*
Styles
*/
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
  },
});

class PostsTable extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      posts: null,
      postId: null,
      postAction: null,
      dialogOpen: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }

  handleDialogOpen = (postId, postAction) => {
    let title = '';
    let message = '';

    switch(postAction) {
      case POSTACTIONSENUM.DELETE:
        title = 'Delete from the database?';
        message= `Do you wish permenantly delete the post with id ${postId}?`;
        break;
      case POSTACTIONSENUM.SOFTDELETE:
        title = 'Soft-delete from the database?';
        message= `Do you wish to soft-delete the post with id ${postId}?`;
        break;
      case POSTACTIONSENUM.SOFTUNDELETE:
        title = 'Soft-undelete from the database?';
        message= `Do you wish to soft-undelete the post with id ${postId}?`;
        break;
    }

    this.setState({
      postId: postId,
      postAction: postAction,
      dialogOpen: true,
      dialogTitle: title,
      dialogMessage: message
    });
  };

  handleDialogClose = () => {
    this.setState({dialogOpen: false});
  };

  handleDialogSubmit = () => {
    let url = '';
    let options = {};

    switch(this.state.postAction) {
      case POSTACTIONSENUM.DELETE:
        url = `/api/v1/posts/${this.state.postId}`;
        options = {
          method: 'DELETE'
        }
        break;
      case POSTACTIONSENUM.SOFTDELETE:
        url = `/api/v1/posts/${this.state.postId}/softdelete`;
        options = {
          method: 'PATCH'
        }
        break;
      case POSTACTIONSENUM.SOFTUNDELETE:
        url = `/api/v1/posts/${this.state.postId}/softundelete`;
        options = {
          method: 'PATCH'
        }
        break;
    }

    fetch(url, options)
      .then(res => res.json())
      .then(results => {
        if(results.action && results.action === 'DELETE') {
          this.loadPosts();
        } else {
          const post = results;
          const i = this.state.posts.findIndex((obj, index, array) => {
            return obj._id === post._id;
          });
          const posts = this.state.posts;
          posts[i] = post;
  
          this.setState({
            posts: posts
          })
        }
        }
      );

    this.handleDialogClose();
  }

  componentWillMount() {
    this.loadPosts();
  }

  loadPosts = () => {
    fetch('/api/v1/posts')
      .then( response => response.json())
      .then( item => this.setState({ posts: item })); 
  }

  getPostsAsJSX() {
    let containerElement = '';
    if(this.state.posts) {
      containerElement = this.state.posts.map( (post, index) => (
        <TableRow key={post._id}>
          <TableCell>{post.title}</TableCell>
          <TableCell>{post.synopsis}</TableCell>
          <TableCell>{post.created_at}</TableCell>
          <TableCell>
            <IconButton
              component={Link} to={ '/backoffice/post-create?id=' + post._id}>
              <IconCreate />
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(post._id, (post.deleted_at)?POSTACTIONSENUM.SOFTUNDELETE:POSTACTIONSENUM.SOFTDELETE)} style={{ opacity: ((post.deleted_at)?0.3:1) }}>
              <IconDelete/>
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(post._id, POSTACTIONSENUM.DELETE)}>
              <IconDeleteForever />
            </IconButton>
          </TableCell>
        </TableRow>));
    }
    return containerElement;
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell numeric>Synopsis</TableCell>
              <TableCell numeric>Created</TableCell>
              <TableCell numeric>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {this.getPostsAsJSX()}
          </TableBody>
        </Table>
        <Dialog
          fullScreen={false}
          open={this.state.dialogOpen}
          onClose={this.handleDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">{this.state.dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.dialogMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDialogClose()} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.handleDialogSubmit()} color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )  
  }
}

PostsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PostsTable);