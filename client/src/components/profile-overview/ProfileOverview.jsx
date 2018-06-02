import React, { Component } from 'react';
import { withStyles, List, ListSubheader, ListItem, ListItemText, Divider, ListItemIcon, Avatar } from 'material-ui';
import IconDirectionsBike from '@material-ui/icons/DirectionsBike';
import IconComment from '@material-ui/icons/Comment';
import { Link } from 'react-router-dom';
import * as moment from 'moment';
import LoadingIndicator from '../loading-indicator/LoadingIndicator';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    marginTop: '1rem',
    marginBottom: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
});
class ProfileOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      comments: null,
      loading: true,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      fetch(`/api/v1/backoffice/profile/${this.props.profileId}`)
        .then(response => response.json())
        .then(item => this.setState({ profile: item, loading: false }));

    }, 1000);
    fetch(`/api/v1/backoffice/profile/comments/${this.props.profileId}`)
      .then(response => response.json())
      .then(item => this.setState({ comments: item, loading: false }));
  }
  getActivitiesAsJsx = () => {
    let activitiesElements = '';
    if (this.state.profile) {
      activitiesElements = this.state.profile.activities.map(
        (element) => {
          return (
            <ListItem button component={Link} to={'/backoffice/activity-overview/' + element._id}>
              <ListItemIcon>
                <IconDirectionsBike />
              </ListItemIcon>
              <ListItemText primary={parseFloat(element.distance / 1000).toFixed(2) + ' km'} />
            </ListItem>
          )
        }
      )
    }
    return activitiesElements;
  }

  getCommentsAsJsx = () => {
    let commentsElements = '';
    if (this.state.comments) {
      commentsElements = this.state.comments.map(
        (element) => {
          return (
            <ListItem button component={Link} to={'/backoffice/comment-overview/' + element._id}>
              <ListItemIcon>
              <IconComment />
              </ListItemIcon>
              <ListItemText primary={element.body} />
            </ListItem>
          )
        }
      )
    }
    return commentsElements;
  }

  render() {
    const { classes } = this.props;
    const profile = this.state.profile;
    if (this.state.profile && this.state.comments) {
      return (
        <List className={classes.root}>
          <ListSubheader>Id</ListSubheader>
          <ListItem>
            <ListItemText primary={profile._id} />
          </ListItem>
          <ListSubheader>Name</ListSubheader>
          <ListItem>
            <Avatar src={profile.avatar} />
            <ListItemText primary={profile.first_name + ' ' + profile.last_name} />
          </ListItem>
          <ListSubheader>Email</ListSubheader>
          <ListItem>
            <ListItemText primary={profile.email} />
          </ListItem>
          <ListSubheader>Created</ListSubheader>
          <ListItem>
            <ListItemText primary={moment(profile.created_at).format('DD/MM/YYYY - hh:mm')} />
          </ListItem>
          <ListSubheader>Stats</ListSubheader>
          <ListItem>
            <ListItemText primary={parseFloat(profile.stats.km / 1000).toFixed(2) + ' km'} />
          </ListItem>
          <ListItem>
            <ListItemText primary={parseFloat(profile.stats.pts).toFixed() + ' points'} />
          </ListItem>
          <ListItem>
            <ListItemText primary={parseFloat(profile.stats.co).toFixed() + ' co'} />
          </ListItem>
          <Divider />
          <ListSubheader>{`Activities (${profile.activities.length})`}</ListSubheader>
          {this.getActivitiesAsJsx()}
          <Divider />
          <ListSubheader>{`Comments (${this.state.comments.length})`}</ListSubheader>
          {this.getCommentsAsJsx()}
        </List>
      );
    } else{
      return (
        <LoadingIndicator />
      )
    }

  }
}

export default withStyles(styles)(ProfileOverview);