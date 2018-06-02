import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, CircularProgress } from 'material-ui';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class LoadingIndicator extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className="d-flex justify-content-center">
        <CircularProgress className={classes.progress} thickness={5}/>
      </div>
    );
  }
}

LoadingIndicator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingIndicator);