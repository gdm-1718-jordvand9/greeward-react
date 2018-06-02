import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, withStyles } from 'material-ui'
import Card from '../../components/card/Card';
const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: '100%',
    marginTop: '1rem',
    backgroundColor: theme.palette.background.paper,
  },
});
class BackofficePage extends Component {
  render() {
    const { classes } = this.props;
    return (
        <Card >
        <h1>Backoffice</h1>
        <List className={classes.root}>
          <ListItem button component={Link} to="/backoffice/activities-table">
            <ListItemText primary="Activities" />
          </ListItem>
          <ListItem button component={Link} to="/backoffice/comments-table">
            <ListItemText primary="Comments" />
          </ListItem>
          <ListItem button component={Link} to="/backoffice/users-table">
            <ListItemText primary="Users" />
          </ListItem>
        </List>
      </Card>
    );
  }
}
BackofficePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BackofficePage);