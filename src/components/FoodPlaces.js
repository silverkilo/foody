import {Component} from 'react';
import MapGL, {Marker} from 'react-map-gl';
import React from 'react'
import './mapstyles.css'

function randomIcon(){
  return Math.floor(Math.random() * 8) + 1;
}

export class FoodPlaces extends Component {
  constructor(){
  super()
  this.state = {
    viewport: {
      width: 375,
      height: 812,
      latitude: 40.7128,
      longitude: -74.0060,
      zoom: 14
    },
    icon: randomIcon(),
    lat: 40.7128,
    long: -74.0060,
    venues: []
    }
    this.test = this.test.bind(this)
    this.getVenues = this.getVenues.bind(this)
  }

  componentDidMount() {
    this.setState({
      icon: randomIcon()
    })
    this.getVenues();
  }

  getVenues() {
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/explore?';

    const params = {
      client_id: 'ZJWIIRNTTOXTXGYZCHG3YPBEUHSCWKNE00T3LBIE15FXARUB',
      client_secret: 'KBJ5SOQRK3LL3LO1SPEMO4XWYOU0TVRE2XEPL5G2P1V44QXS',
      limit: 100,
      query: 'Food',
      v: '20130619', // version of the API
      ll: `${this.state.lat}, ${this.state.long}`
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      this.setState({venues: response.response.groups[0].items});
    });
  }

  test(position) {
    let lat = position.coords.latitude
    let long = position.coords.longitude
    this.setState({
      viewport: {...this.state.viewport, latitude: lat, longitude: long},
      lat: lat,
      long: long
    })
  }

  render(){
    window.navigator.geolocation.getCurrentPosition(this.test)
    return (
      <MapGL
        {...this.state.viewport}
        mapStyle='mapbox://styles/rhearao/cjv749h8x1o4f1fpff04veqj9'
        onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken={'pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanQ0ajJ3MjUwMjJrNDlvM2ExcmszcXZ3In0.xztopoCKZUlUCYgWMy7Djw'}
      >
        <Marker latitude={this.state.lat} longitude={this.state.long} offsetLeft={-20} offsetTop={-10}>
          <div className={`marker marker${this.state.icon}`}></div>
        </Marker>

        {this.state.venues.map(item =>
          <Marker latitude={item.venue.location.lat} longitude={item.venue.location.lng} offsetLeft={-20} offsetTop={-10}>
          {/* <div>{item.venue.name}</div> */}
          <div className={`foodMarker food`}></div>
        </Marker>
        )}

      </MapGL>
  )}
}
