import {Component} from 'react';
import MapGL from 'react-map-gl';
import React from 'react'

export class Map extends Component {
  constructor(){
  super()
  this.state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }
    }
  }

  render(){
    return (
      <MapGL
        {...this.state.viewport}
        mapStyle='mapbox://styles/rhearao/cjv749h8x1o4f1fpff04veqj9'
        onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken={'pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanQ0ajJ3MjUwMjJrNDlvM2ExcmszcXZ3In0.xztopoCKZUlUCYgWMy7Djw'}
      />
  )}
}



