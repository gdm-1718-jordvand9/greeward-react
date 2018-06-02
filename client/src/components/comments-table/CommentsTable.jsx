import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Libraries
*/
import Enum from "es6-enum";
import * as moment from 'moment';

/*
Components
*/
import { Link } from 'react-router-dom';

/*
Material UI
*/
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import IconDelete from '@material-ui/icons/Delete';
import IconInfo from '@material-ui/icons/Info';
import IconDeleteForever from '@material-ui/icons/DeleteForever';

const COMMENTACTIONSENUM = Enum('DELETE', 'SOFTDELETE', 'SOFTUNDELETE');

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

class CommentsTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      comments: null,
      commentId: null,
      commentAction: null,
      dialogOpen: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }

  handleDialogOpen = (commentId, commentAction) => {
    let title = '';
    let message = '';

    switch (commentAction) {
      case COMMENTACTIONSENUM.DELETE:
        title = 'Delete from the database?';
        message = `Do you wish permenantly delete the comment with id ${commentId}?`;
        break;
      case COMMENTACTIONSENUM.SOFTDELETE:
        title = 'Soft-delete from the database?';
        message = `Do you wish to soft-delete the comment with id ${commentId}?`;
        break;
      case COMMENTACTIONSENUM.SOFTUNDELETE:
        title = 'Soft-undelete from the database?';
        message = `Do you wish to soft-undelete the comment with id ${commentId}?`;
        break;
    }

    this.setState({
      commentId: commentId,
      commentAction: commentAction,
      dialogOpen: true,
      dialogTitle: title,
      dialogMessage: message
    });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDialogSubmit = () => {
    let url = '';
    let options = {};

    switch (this.state.commentAction) {
      case COMMENTACTIONSENUM.DELETE:
        url = `https://greeward.herokuapp.com/api/v1/comments/${this.state.commentId}`;
        options = {
          method: 'DELETE'
        }
        break;
      case COMMENTACTIONSENUM.SOFTDELETE:
        url = `https://greeward.herokuapp.com/api/v1/comments/${this.state.commentId}/softdelete`;
        options = {
          method: 'PATCH'
        }
        break;
      case COMMENTACTIONSENUM.SOFTUNDELETE:
        url = `https://greeward.herokuapp.com/api/v1/comments/${this.state.commentId}/softundelete`;
        options = {
          method: 'PATCH'
        }
        break;
    }

    fetch(url, options)
      .then(res => res.json())
      .then(results => {
        if (results.action && results.action === 'DELETE') {
          this.loadActivties();
        } else {
          const comment = results;
          const i = this.state.comments.findIndex((obj, index, array) => {
            return obj._id === comment._id;
          });
          const comments = this.state.comments;
          comments[i] = comment;

          this.setState({
            comments: comments
          })
        }
      }
      );

    this.handleDialogClose();
  }

  componentWillMount() {
    this.loadActivties();
  }

  loadActivties = () => {
    fetch('https://greeward.herokuapp.com/api/v1/backoffice/comments')
      .then(response => response.json())
      .then(item => this.setState({ comments: item }));
  }

  getCommentsAsJSX() {
    let containerElement = '';
    if (this.state.comments) {
      console.log(this.state.comments);
      containerElement = this.state.comments.map((comment, index) => (
        <TableRow key={comment._id}>
          <TableCell>{comment._user.first_name + ' ' + comment._user.last_name}</TableCell>
          <TableCell>{comment.body}</TableCell>
          <TableCell>{moment(comment.created_at).format('DD/MM/YYYY')}</TableCell>
          <TableCell component={Link} to={`/backoffice/activity/${comment._activity}`}>{comment._activity}</TableCell>
          <TableCell>
            <IconButton
              onClick={() => this.handleDialogOpen(comment._id, (comment.deleted_at) ? COMMENTACTIONSENUM.SOFTUNDELETE : COMMENTACTIONSENUM.SOFTDELETE)} style={{ opacity: ((comment.deleted_at) ? 0.3 : 1) }}>
              <IconDelete />
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(comment._id, COMMENTACTIONSENUM.DELETE)}>
              <IconDeleteForever />
            </IconButton>
            <IconButton>
              <IconInfo />
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
              <TableCell>User</TableCell>
              <TableCell>Body</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.getCommentsAsJSX()}
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

CommentsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentsTable);