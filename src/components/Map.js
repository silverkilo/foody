import React, { Component } from 'react';
import DeckGL from '@deck.gl/react';
import { LineLayer } from '@deck.gl/layers';
import StaticMap, { Marker } from 'react-map-gl';
import { connect } from 'react-redux';
import { setUserLatLong, getMatchLatLong } from '../store/location'
import { getMatchPreference } from '../store/matchPreference'
import './mapstyles.css'
<<<<<<< HEAD
import ReactSwipe from 'react-swipe';
import {FoodDetails} from './FoodDetails'
=======

const mapAccess = {
  mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
}
>>>>>>> master

const data = [{ sourcePosition: [-74.006, 40.712], targetPosition: [-73.977, 40.731] }];

function randomIcon() {
  return Math.floor(Math.random() * 8) + 1;
}

export class Map extends Component {
  constructor() {
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
      venuesMatch: [],
      allVenues: [],
      // THE BELOW MATCH PREFERENCES JUST HAS SOME PLACEHOLDER PREFERENCES FOR TESTING
      matchPreferences: ['Food Truck', 'Supermarket', 'Food Stand'],
      loadedVenues: false,
      loadedUser: false
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
      icon2: randomIcon(),
      // COMMENT THE BELOW BACK IN ONCE WE HAVE THE MATCH PREFERENCES
      // matchPreferences: this.props.getMatchPreference(this.props.userId)
    })
    window.setTimeout(this.getVenuesUser, 9000)
    window.setTimeout(this.getVenuesMatch, 9000)
  }

  getVenuesUser() {
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/search?';

    const params = {
      client_id: 'NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ',
      client_secret: 'YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM',
      limit: 20,
      query: 'Food',
      v: '20130619', // version of the API
      ll: `${this.state.lat}, ${this.state.long}`,
      radius: 600
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
<<<<<<< HEAD
      // filter out those places without category names
      let filteredWithoutCategories = response.response.venues.filter((eachPlace =>
        (eachPlace.categories[0] !== undefined)
      ))
      // filter out places with categories that don't match the user's preferences
      let filtered = filteredWithoutCategories.filter((eachPlace =>
        (this.state.matchPreferences.indexOf(eachPlace.categories[0].name) > -1)
      ))
      this.setState({venuesUser: filtered});
      console.log('venues user', this.state.venuesUser)
=======
      let filtered = response.response.venues.filter((eachPlace => (this.state.matchPreferences.indexOf(eachPlace.categories[0]['name']) > -1)))
      this.setState({ venuesUser: filtered });
>>>>>>> master
    });
  }

  getVenuesMatch() {
    const venuesEndpoint = 'https://api.foursquare.com/v2/venues/search?';

    const params = {
      client_id: 'NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ',
      client_secret: 'YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM',
      limit: 5,
      query: 'Food',
      v: '20130619', // version of the API
      ll: `${this.props.matchLat}, ${this.props.matchLong}`,
      radius: 600
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
<<<<<<< HEAD
      // filter out those places without category names
      let filteredWithoutCategories = response.response.venues.filter((eachPlace =>
        (eachPlace.categories[0] !== undefined)
      ))
      // filter out places with categories that don't match the user's preferences
      let filtered = filteredWithoutCategories.filter((eachPlace =>
        (this.state.matchPreferences.indexOf(eachPlace.categories[0].name) > -1)
      ))
      this.setState({venuesMatch: filtered});
      console.log('venues match', this.state.venuesMatch)
=======
      let filtered = response.response.venues.filter((eachPlace => (this.state.matchPreferences.indexOf(eachPlace.categories[0]['name']) > -1)))
      this.setState({ venuesMatch: filtered });
>>>>>>> master
    });
    this.setState({
      loadedVenues: true,
      // allVenus: this.state.venuesUser.concat(this.state.venuesMatch)
    })
    // console.log("ALLVENUES", this.state.allVenues)
  }

  getCurrentLocation(position) {
    let lat = position.coords.latitude
    let long = position.coords.longitude
    this.setState({
      viewport: { ...this.state.viewport, latitude: lat, longitude: long },
      lat: lat,
      long: long,
      loadedUser: true
    })
    this.props.setUserLatLong([this.state.lat, this.state.long])
  }

<<<<<<< HEAD
  render(){
    let reactSwipeEl;
    return (
      <div>
      <MapGL
        {...this.state.viewport}
        mapStyle='mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu'
        onViewportChange={(viewport) => this.setState({viewport})}
        mapboxApiAccessToken='pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg'
      >

        <Marker latitude={this.state.lat} longitude={this.state.long} offsetLeft={-20} offsetTop={-10}>
          <div className={`marker marker${this.state.icon}`}></div> </Marker>

        <Marker latitude={this.props.matchLat} longitude={this.props.matchLong} offsetLeft={-20} offsetTop={-10}>
          <div className={`marker marker${this.state.icon2}`}></div>
        </Marker>

        {this.state.venuesUser.map(item =>
          <Marker latitude={item.location.lat} longitude={item.location.lng} offsetLeft={-20} offsetTop={-10} key={item.id}>
          <div className={`foodMarker food`}></div>
        </Marker>
        )}

        {this.state.venuesMatch.map(item =>
          <Marker latitude={item.location.lat} longitude={item.location.lng} offsetLeft={-20} offsetTop={-10} key={item.id}>
          <div className={`foodMarker food`}></div>
        </Marker>
        )}

      </MapGL>

      {this.state.loadedVenues &&
        <div>
          <ReactSwipe
            swipeOptions={{ continuous: true }}
            ref={el => (reactSwipeEl = el)}
            childCount={this.state.venuesUser.length}
          >
            {this.state.allVenues.map(venue => (
                <div key={venue.id}>
                  {/* <FoodDetails venueId={venue.id}/> */}
                  <h1>HI</h1>
                  <button>Yes</button>
                  <button>No</button>
                </div>)
            )}
          </ReactSwipe>
          <button onClick={() => reactSwipeEl.next()}>Next</button>
          <button onClick={() => reactSwipeEl.prev()}>Previous</button>
        </div>
      }
      </div>
=======
  render() {
    const layers = [
      new LineLayer({ id: 'line-layer', data })
    ];
    return (
      <DeckGL
        initialViewState={this.state.viewport}
        controller={true}
        layers={layers}
      >
        <StaticMap
          {...mapAccess}
          {...this.state.viewport}
          mapStyle='mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu'
          onViewportChange={(viewport) => this.setState({ viewport })}
        // mapboxApiAccessToken='pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg'
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
        </StaticMap>
      </DeckGL>
>>>>>>> master
    )
  }
}

const mapStateToProps = state => {
  return {
    userName: state.user.name,
    userId: state.user.id,
    matchLat: state.userMatchLatLong.match[0],
    matchLong: state.userMatchLatLong.match[1]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUserLatLong: (arr) => dispatch(setUserLatLong(arr)),
    getMatchLatLong: (userId) => dispatch(getMatchLatLong(userId)),
    getMatchPreference: (userId) => dispatch(getMatchPreference(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)
