import React, {Component} from 'react';
import MapGL, {Marker} from 'react-map-gl';
import { connect } from 'react-redux';
import { setUserNeighborhood }  from '../store/neighborhood'
import { setUserLatLong, getMatchLatLong } from '../store/location'
import './mapstyles.css'


const mapAccess = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
}

const fourSquareAccess = {
  client_id: process.env.client_id,
  client_secret: process.env.client_secret
}

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
      icon2: randomIcon(),
      lat: 40.754,
      long: -73.984,
      venuesUser: [],
      venuesMatch: []
    }
    this.getCurrentLocation = this.getCurrentLocation.bind(this)
    this.getVenuesUser = this.getVenuesUser.bind(this)
    this.getVenuesMatch = this.getVenuesMatch.bind(this)
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation)
    this.props.getMatchLatLong(this.props.userId)
    this.setState({
      icon: randomIcon(),
      icon2: randomIcon()
    })
    window.setTimeout(this.getVenuesUser, 3000)
    window.setTimeout(this.getVenuesMatch, 3000)
  }

  getVenuesUser() {
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/search?';

    const params = {
      client_id: 'C31O5PRPCMXK5NSFRPCN0PD5R2VRUQCOCU4TMD3MKCXCPLTF',
      client_secret: 'Z2ZPHY0VHFQIFNJKOQFAOUBVZWRKZIQJYWE1TNJGO2YJT4VR',
      limit: 50,
      query: 'Food',
      v: '20130619', // version of the API
      ll: `${this.state.lat}, ${this.state.long}`,
      radius: 600
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      this.setState({venuesUser: response.response.venues});
    });
  }

  getVenuesMatch() {
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/search?';

    const params = {
      client_id: 'C31O5PRPCMXK5NSFRPCN0PD5R2VRUQCOCU4TMD3MKCXCPLTF',
      client_secret: 'Z2ZPHY0VHFQIFNJKOQFAOUBVZWRKZIQJYWE1TNJGO2YJT4VR',
      limit: 50,
      query: 'Food',
      v: '20130619', // version of the API
      ll: `${this.props.matchLat}, ${this.props.matchLong}`,
      radius: 600
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      this.setState({venuesMatch: response.response.venues});
    });
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

    return (
      <MapGL
        {...mapAccess}
        {...this.state.viewport}
        mapStyle='mapbox://styles/rhearao/cjv749h8x1o4f1fpff04veqj9'
        onViewportChange={(viewport) => this.setState({viewport})}
      >

        <Marker latitude={this.state.lat} longitude={this.state.long} offsetLeft={-20} offsetTop={-10}>
          <div className={`marker marker${this.state.icon}`}></div> </Marker>

        <Marker latitude={this.props.matchLat} longitude={this.props.matchLong} offsetLeft={-20} offsetTop={-10}>
          <div className={`marker marker${this.state.icon2}`}></div>
        </Marker>

        {this.state.venuesUser.map(item =>
          <Marker latitude={item.location.lat} longitude={item.location.lng} offsetLeft={-20} offsetTop={-10} key={item.location.lat}>
          <div className={`foodMarker food`}></div>
        </Marker>
        )}

        {this.state.venuesMatch.map(item =>
          <Marker latitude={item.location.lat} longitude={item.location.lng} offsetLeft={-20} offsetTop={-10} key={item.location.lat}>
          <div className={`foodMarker food`}></div>
        </Marker>
        )}

      </MapGL>
    )
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    matchLat: state.userMatchLatLong.match[0],
    matchLong: state.userMatchLatLong.match[1]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserNeighborhood: (long, lat) => dispatch(setUserNeighborhood(long, lat)),
    setUserLatLong: (arr) => dispatch(setUserLatLong(arr)),
    getMatchLatLong: (userId) => dispatch(getMatchLatLong(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
