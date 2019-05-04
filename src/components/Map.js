import {Component} from 'react';
import MapGL, {Marker} from 'react-map-gl';
import React from 'react'
import './mapstyles.css'

function randomIcon(){
  return Math.floor(Math.random() * 8) + 1;
}

export class Map extends Component {
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
    long: -74.0060
    }
    this.test = this.test.bind(this)
  }

  componentDidMount() {
    this.setState({
      icon: randomIcon()
    })
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
      </MapGL>
  )}
}



