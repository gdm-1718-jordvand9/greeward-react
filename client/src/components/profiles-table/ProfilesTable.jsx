import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
Libraries
*/
import Enum from "es6-enum";
import * as moment from 'moment';
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
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import IconDelete from '@material-ui/icons/Delete';
import IconInfo from '@material-ui/icons/Info';
import IconDeleteForever from '@material-ui/icons/DeleteForever';

const PROFILEACTIONSENUM = Enum('DELETE', 'SOFTDELETE', 'SOFTUNDELETE');

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
      profiles: null,
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
      case PROFILEACTIONSENUM.DELETE:
        title = 'Delete from the database?';
        message = `Do you wish permenantly delete the profile with id ${commentId}?`;
        break;
      case PROFILEACTIONSENUM.SOFTDELETE:
        title = 'Soft-delete from the database?';
        message = `Do you wish to soft-delete the profile with id ${commentId}?`;
        break;
      case PROFILEACTIONSENUM.SOFTUNDELETE:
        title = 'Soft-undelete from the database?';
        message = `Do you wish to soft-undelete the profile with id ${commentId}?`;
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
      case PROFILEACTIONSENUM.DELETE:
        url = `https://greeward.herokuapp.com/api/v1/profiles/${this.state.commentId}`;
        options = {
          method: 'DELETE'
        }
        break;
      case PROFILEACTIONSENUM.SOFTDELETE:
        url = `https://greeward.herokuapp.com/api/v1/profiles/${this.state.commentId}/softdelete`;
        options = {
          method: 'PATCH'
        }
        break;
      case PROFILEACTIONSENUM.SOFTUNDELETE:
        url = `https://greeward.herokuapp.com/api/v1/profiles/${this.state.commentId}/softundelete`;
        options = {
          method: 'PATCH'
        }
        break;
    }

    fetch(url, options)
      .then(res => res.json())
      .then(results => {
        if (results.action && results.action === 'DELETE') {
          this.loadProfiles();
        } else {
          const profile = results;
          const i = this.state.profiles.findIndex((obj, index, array) => {
            return obj._id === profile._id;
          });
          const profiles = this.state.profiles;
          profiles[i] = profile;

          this.setState({
            profiles: profiles
          })
        }
      }
      );

    this.handleDialogClose();
  }

  componentWillMount() {
    this.loadProfiles();
  }

  loadProfiles = () => {
    fetch('https://greeward.herokuapp.com/api/v1/backoffice/profiles')
      .then(response => response.json())
      .then(item => this.setState({ profiles: item }));
  }

  getCommentsAsJSX() {
    let containerElement = '';
    if (this.state.profiles) {
      console.log(this.state.profiles);
      containerElement = this.state.profiles.map((profile, index) => (
        <TableRow key={profile._id}>
          <TableCell>{profile.first_name + ' ' + profile.last_name}</TableCell>
          <TableCell numeric>{parseFloat(profile.stats.co).toFixed()}</TableCell>
          <TableCell numeric>{parseFloat(profile.stats.km / 1000).toFixed(1)}</TableCell>
          <TableCell numeric>{parseFloat(profile.stats.pts).toFixed()}</TableCell>
          <TableCell>{moment(profile.created_at).format('DD/MM/YYYY')}</TableCell>
          <TableCell>
            <IconButton
              onClick={() => this.handleDialogOpen(profile._id, (profile.deleted_at) ? PROFILEACTIONSENUM.SOFTUNDELETE : PROFILEACTIONSENUM.SOFTDELETE)} style={{ opacity: ((profile.deleted_at) ? 0.3 : 1) }}>
              <IconDelete />
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(profile._id, PROFILEACTIONSENUM.DELETE)}>
              <IconDeleteForever />
            </IconButton>
            <IconButton component={Link} to={`/backoffice/profile-overview/${profile._id}`}>
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
              <TableCell numeric>Co</TableCell>
              <TableCell numeric>Km</TableCell>
              <TableCell numeric>Pts</TableCell>
              <TableCell>Created</TableCell>
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