import React, {Component} from 'react';
import MapGL, {Marker} from 'react-map-gl';
import { connect } from 'react-redux';
import { setUserNeighborhood }  from '../store/neighborhood'
import { setUserLatLong } from '../store/location'
import Geocoder from 'react-map-gl-geocoder';
import geocodingClient from 'react-map-gl-geocoder';
import './mapstyles.css'
import axios from 'axios';


const mapAccess = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
}

function randomIcon(){
  return Math.floor(Math.random() * 8) + 1;
}

class Map extends Component {
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
    this.getCurrentLocation = this.getCurrentLocation.bind(this)
  }

  componentDidMount() {
    this.setState({
      icon: randomIcon()
    })
  }

  getCurrentLocation(position) {
    let lat = position.coords.latitude
    let long = position.coords.longitude
    this.setState({
      viewport: {...this.state.viewport, latitude: lat, longitude: long},
      lat: lat,
      long: long
    })
    this.props.setUserLatLong([this.state.lat, this.state.long])
    this.props.setUserNeighborhood(this.state.long, this.state.lat)
  }


  render(){
    window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation)

    return (
      <div>

        <MapGL
          {...mapAccess}
          {...this.state.viewport}
          mapStyle='mapbox://styles/rhearao/cjv749h8x1o4f1fpff04veqj9'
          onViewportChange={(viewport) => this.setState({viewport})}
        >
          <Marker latitude={this.state.lat} longitude={this.state.long} offsetLeft={-20} offsetTop={-10}>
            <div className={`marker marker${this.state.icon}`}></div>
          </Marker>
        </MapGL>

        {/* <Geocoder
          {...mapAccess}
          mapRef={this.mapRef}
          onSelected={this.componentDidMount}
          queryParams={queryParams}
        /> */}

      </div>
  )}
}

const mapDispatchToProps = dispatch => {
  return {
    setUserNeighborhood: (long, lat) => dispatch(setUserNeighborhood(long, lat)),
    setUserLatLong: (arr) => dispatch(setUserLatLong(arr))
  }
}

export default connect(null, mapDispatchToProps)(Map)


