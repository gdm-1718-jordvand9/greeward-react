/* global google */
import React, { Component } from 'react';

/* 
Google Maps
*/
import { GoogleMap, withGoogleMap, DirectionsRenderer } from 'react-google-maps'

/* 
Styles
*/
import './Map.css';

const styles = require('./style.json');

class Map extends Component {
  constructor(props) {
    super(props);
    this.state= {
      directions: null,
    }
    console.log(props);
    console.log(this.state);
  }
  componentDidMount() {
    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route({
      origin: this.props.origin,
      destination: this.props.destination,
      travelMode: google.maps.TravelMode.BICYCLING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
        });
      } else {
        console.error(`error fetching directions ${result}`);
      }
    })
  }

  render() {
    const MapComponent = withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={7}
        defaultOptions={{styles: styles}}
      >
      {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
      </GoogleMap>
    )
    console.log(this.props);
    return (
      <MapComponent
        loadingElement={<div style={{ height: `15rem` }} />}
        containerElement={<div style={{ height: `15rem`, borderRadius: `10 px` }} />}
        mapElement={<div style={{ height: `100%`, borderRadius: `10 px` }} />}
      />
    );
  }
}

export default Map;