import React, { Component } from 'react';

/*
Components
*/
import { Link } from 'react-router-dom';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

/*
Libraries
*/
import * as moment from 'moment';

/*
Material UI
*/
import { withStyles, List, ListSubheader, ListItem, ListItemText, Divider, ListItemIcon, Avatar } from 'material-ui';
import IconComment from '@material-ui/icons/Comment';
import IconThumbUp from '@material-ui/icons/ThumbUp';
import IconList from '@material-ui/icons/List';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    marginTop: '1rem',
    marginBottom: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
});

class ActivityOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activity: null,
      loading: true,
    }
  }

  componentDidMount() {
    fetch(`https://greeward.herokuapp.com/api/v1/backoffice/activity/${this.props.activityId}`)
      .then(response => response.json())
      .then(item => this.setState({ activity: item, loading: false }));
  }

  getCommentsAsJsx = () => {
    let commentElements = '';
    if (this.state.activity) {
      commentElements = this.state.activity.comments.map(
        (element) => {
          return (
            <ListItem button component={Link} to={'/backoffice/comment-overview/' + element._id}>
              <ListItemIcon>
                <IconComment />
              </ListItemIcon>
              <ListItemText primary={element.body} />
            </ListItem>
          );
        }
      )
    };
    return commentElements;
  }

  getLikesAsJsx = () => {
    let likesElements = '';
    if (this.state.activity) {
      likesElements = this.state.activity.likes.map(
        (element) => {
          return (
            <ListItem button component={Link} to={'/backoffice/profile-overview/' + element._id}>
              <ListItemIcon>
                <IconThumbUp />
              </ListItemIcon>
              <ListItemText primary={element.first_name + ' ' + element.last_name} />
            </ListItem>
          )
        }
      )
    }
    return likesElements;
  }

  render() {
    const { classes } = this.props;
    const activity = this.state.activity;
    if (this.state.activity) {
      return (
        <List className={classes.root}>
        <ListItem>
            <ListItemText primary="Activity" />
            <Avatar component={Link} to="/backoffice/activities-table" classes={classes.avatar}>
              <IconList />
            </Avatar>
          </ListItem>
          <ListSubheader>Id</ListSubheader>
          <ListItem>
            <ListItemText primary={activity._id} />
          </ListItem>
          <ListSubheader>Created</ListSubheader>
          <ListItem>
            <ListItemText primary={moment(activity.created_at).format('DD/MM/YYYY - hh:mm')} />
          </ListItem>
          <ListSubheader>User</ListSubheader>
          <ListItem button component={Link} to={'/backoffice/profile-overview/' + activity._user._id}>
            <Avatar src={activity._user.avatar} />
            <ListItemText primary={activity._user.first_name + ' ' + activity._user.last_name} />
          </ListItem>
          <ListSubheader>Details</ListSubheader>
          <ListItem>
            <ListItemText primary={parseFloat(activity.distance / 1000).toFixed(2) + ' km'} />
          </ListItem>
          <ListItem>
            <ListItemText primary={parseFloat(activity.points).toFixed() + ' points'} />
          </ListItem>
          <ListItem>
            <ListItemText primary={parseFloat(activity.distance / 9).toFixed(2) + ' co'} />
          </ListItem>
          <Divider />
          <ListSubheader>{`Comments (${activity.comments.length})`}</ListSubheader>
          {this.getCommentsAsJsx()}
          <Divider />
          <ListSubheader>{`Likes (${activity.likes.length})`}</ListSubheader>
          {this.getLikesAsJsx()}
        </List>
      );
    } else {
      return (
        <LoadingIndicator />
      )
    }
  }
}

export default withStyles(styles)(ActivityOverview);