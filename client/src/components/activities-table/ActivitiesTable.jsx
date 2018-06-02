import React, { Component } from 'react';
import PropTypes from 'prop-types';


/*
Libraries
*/
import { Link } from 'react-router-dom';
import Enum from "es6-enum";
import * as moment from 'moment';

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
import IconCreate from '@material-ui/icons/Create';
import IconDelete from '@material-ui/icons/Delete';
import IconInfo from '@material-ui/icons/Info';
import IconDeleteForever from '@material-ui/icons/DeleteForever';

const ACTIVITYACTIONSENUM = Enum('DELETE', 'SOFTDELETE', 'SOFTUNDELETE');

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

class ActivitiesTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activities: null,
      activityId: null,
      activityAction: null,
      dialogOpen: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }

  handleDialogOpen = (activityId, activityAction) => {
    let title = '';
    let message = '';

    switch (activityAction) {
      case ACTIVITYACTIONSENUM.DELETE:
        title = 'Delete from the database?';
        message = `Do you wish permenantly delete the activity with id ${activityId}?`;
        break;
      case ACTIVITYACTIONSENUM.SOFTDELETE:
        title = 'Soft-delete from the database?';
        message = `Do you wish to soft-delete the activity with id ${activityId}?`;
        break;
      case ACTIVITYACTIONSENUM.SOFTUNDELETE:
        title = 'Soft-undelete from the database?';
        message = `Do you wish to soft-undelete the activity with id ${activityId}?`;
        break;
    }

    this.setState({
      activityId: activityId,
      activityAction: activityAction,
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

    switch (this.state.activityAction) {
      case ACTIVITYACTIONSENUM.DELETE:
        url = `/api/v1/activities/${this.state.activityId}`;
        options = {
          method: 'DELETE'
        }
        break;
      case ACTIVITYACTIONSENUM.SOFTDELETE:
        url = `/api/v1/activities/${this.state.activityId}/softdelete`;
        options = {
          method: 'PATCH'
        }
        break;
      case ACTIVITYACTIONSENUM.SOFTUNDELETE:
        url = `/api/v1/activities/${this.state.activityId}/softundelete`;
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
          const activity = results;
          const i = this.state.activities.findIndex((obj, index, array) => {
            return obj._id === activity._id;
          });
          const activities = this.state.activities;
          activities[i] = activity;

          this.setState({
            activities: activities
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
    fetch('/api/v1/backoffice/activities')
      .then(response => response.json())
      .then(item => this.setState({ activities: item }));
  }

  getActivitiesAsJSX() {
    let containerElement = '';
    if (this.state.activities) {
      containerElement = this.state.activities.map((activity, index) => (
        <TableRow key={activity._id}>
          <TableCell>{activity._user.first_name + ' ' + activity._user.last_name}</TableCell>
          <TableCell numeric>{parseFloat(activity.distance / 1000).toFixed(1)}</TableCell>
          <TableCell numeric>{(activity.points).toFixed()}</TableCell>
          <TableCell>{moment(activity.created_at).format('DD/MM/YYYY')}</TableCell>
          <TableCell>
            <IconButton
              component={Link} to={'/backoffice/activity-create?id=' + activity._id}>
              <IconCreate />
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(activity._id, (activity.deleted_at) ? ACTIVITYACTIONSENUM.SOFTUNDELETE : ACTIVITYACTIONSENUM.SOFTDELETE)} style={{ opacity: ((activity.deleted_at) ? 0.3 : 1) }}>
              <IconDelete />
            </IconButton>
            <IconButton
              onClick={() => this.handleDialogOpen(activity._id, ACTIVITYACTIONSENUM.DELETE)}>
              <IconDeleteForever />
            </IconButton>
            <IconButton
              component={Link} to={'/backoffice/activity-overview/' + activity._id}>
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
              <TableCell>Name</TableCell>
              <TableCell numeric>Distance</TableCell>
              <TableCell numeric>Points</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.getActivitiesAsJSX()}
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

ActivitiesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActivitiesTable);