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
import IconDirectionsBike from '@material-ui/icons/DirectionsBike';
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

class CommentOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: null,
      loading: true
    }
  }

  componentDidMount() {
    fetch(`https://greeward.herokuapp.com/api/v1/backoffice/comment/${this.props.commentId}`)
      .then(response => response.json())
      .then(item => this.setState({ comment: item, loading: false }));
  }

  render() {
    const { classes } = this.props;
    const comment = this.state.comment;
    if (this.state.comment) {
      return (
        <List className={classes.root}>
        <ListItem>
            <ListItemText primary="Comment" />
            <Avatar component={Link} to="/backoffice/activities-table" classes={classes.avatar}>
              <IconList />
            </Avatar>
          </ListItem>
          <ListSubheader>Id</ListSubheader>
          <ListItem>
            <ListItemText primary={comment._id} />
          </ListItem>
          <ListSubheader>Body</ListSubheader>
          <ListItem>
            <ListItemText primary={comment.body} />
          </ListItem>
          <ListSubheader>User</ListSubheader>
          <ListItem button component={Link} to={'/backoffice/profile-overview/' + comment._user._id}>
            <Avatar src={comment._user.avatar} />
            <ListItemText primary={comment._user.first_name + ' ' + comment._user.last_name} />
          </ListItem>
          <ListSubheader>Created</ListSubheader>
          <ListItem>
            <ListItemText primary={moment(comment.created_at).format('DD/MM/YYYY - hh:mm')} />
          </ListItem>
          <Divider />
          <ListSubheader>Activity</ListSubheader>
          <ListItem button component={Link} to={'/backoffice/activity-overview/' + comment._activity}>
            <ListItemIcon>
              <IconDirectionsBike />
            </ListItemIcon>
            <ListItemText primary={comment._activity} />
          </ListItem>
        </List>
      );
    } else {
      return (
        <LoadingIndicator />
      )
    }
  }
}

export default withStyles(styles)(CommentOverview);