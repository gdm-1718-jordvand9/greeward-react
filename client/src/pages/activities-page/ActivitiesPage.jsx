import React, { Component } from 'react';
import ActivitiesList from '../../components/activities-list/ActivitiesList';


/* global google */
/*
Component styles
*/

class ActivitiesPage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
      return (
        <ActivitiesList />
      )
    }
  }

export default (ActivitiesPage);