import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import SwipeLayer from "./SwipeLayer";
import { connect } from "react-redux";
import { setUserLatLong, getMatchLatLong } from "../store/location";
import { setSelectedIdx } from "../store/highlight";
import { getMatchPreference } from "../store/matchPreference";
import { joinChatRoom } from "../store/chat";
import { setIconImg } from "../store/icon";
import Chat from "./Chat";
import "./mapstyles.css";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// }

function randomIcon() {
  return Math.floor(Math.random() * 8) + 1;
}

export class MapBox extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100%",
        height: "100vh",
        latitude: 40.754,
        longitude: -73.984,
        zoom: 14
      },
      lat: 40.754,
      long: -73.984,
      venuesUser: [],
      venuesMatch: [],
      allVenues: [],
      // THE BELOW MATCH PREFERENCES JUST HAS SOME PLACEHOLDER PREFERENCES FOR TESTING
      matchPreferences: [
        "Food Truck",
        "Supermarket",
        "Food Stand",
        "Asian Restaurant"
      ],
      loadedVenues: false,
      loadedUser: false,
      showChat: false
    };
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation);
    this.props.getMatchLatLong(this.props.userId);
    this.props.setIconImg();
    this.setState({
      // COMMENT THE BELOW BACK IN ONCE WE HAVE THE MATCH PREFERENCES
      // matchPreferences: this.props.matchPreference
    });
    window.setTimeout(this.getVenuesUser, 4000);
    window.setTimeout(this.getVenuesMatch, 6000);
  }

  getVenuesUser = () => {
    const venuesEndpoint = "https://api.foursquare.com/v2/venues/search?";

    const params = {
      client_id: "KUZ0H02M1VQNYUNKV40GFCICQUYGHRZJQVFLFS4MK01IHFYE",
      client_secret: "ESQTWW5FJSPUDTTCM5JWQ1EO3T1GXNRVMS5XTKR3AKC4GNVJ",
      limit: 50,
      query: "Food",
      v: "20130619", // version of the API
      ll: `${this.state.lat}, ${this.state.long}`,
      radius: 700
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        // filter out those places without category names
        let filteredWithoutCategories = response.response.venues.filter(
          eachPlace => eachPlace.categories[0] !== undefined
        );
        // filter out places with categories that don't match the user's preferences
        let filtered = filteredWithoutCategories.filter(
          eachPlace =>
            this.state.matchPreferences.indexOf(eachPlace.categories[0].name) >
            -1
        );
        // this.setState({ venuesUser: filtered });
        this.setState({
          venuesUser: response.response.venues
        });
      });
  };

  getVenuesMatch = () => {
    const venuesEndpoint = "https://api.foursquare.com/v2/venues/search?";

    const params = {
      client_id: "KUZ0H02M1VQNYUNKV40GFCICQUYGHRZJQVFLFS4MK01IHFYE",
      client_secret: "ESQTWW5FJSPUDTTCM5JWQ1EO3T1GXNRVMS5XTKR3AKC4GNVJ",
      limit: 5,
      query: "Food",
      v: "20130619", // version of the API
      ll: `${this.props.matchLat}, ${this.props.matchLong}`,
      radius: 600
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        // filter out those places without category names
        let filteredWithoutCategories = response.response.venues.filter(
          eachPlace => eachPlace.categories[0] !== undefined
        );
        // filter out places with categories that don't match the user's preferences
        let filtered = filteredWithoutCategories.filter(
          eachPlace =>
            this.state.matchPreferences.indexOf(eachPlace.categories[0].name) >
            -1
        );
        // this.setState({ venuesUser: filtered });
        this.setState({
          venuesUser: response.response.venues
        });
        this.setState({
          allVenues: this.state.venuesUser.concat(this.state.venuesMatch)
        });
      });
    this.setState({
      loadedVenues: true
    });
  };

  getCurrentLocation = position => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    this.setState({
      viewport: {
        ...this.state.viewport,
        latitude: lat,
        longitude: long
      },
      lat: lat,
      long: long,
      loadedUser: true
    });
    this.props.setUserLatLong([this.state.long, this.state.lat]);
  };

  //chat functions
  handleOpenChat = () => {
    // this.setState({ showChat: true });
    let chat = document.querySelector(".chatBox");
    chat.classList.add("is-visible");
    this.props.joinChatRoom();
  };

  handleCloseChat = () => {
    this.setState({
      showChat: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="map">
          <MapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
            onViewportChange={viewport =>
              this.setState({
                viewport
              })
            }
            mapboxApiAccessToken="pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg"
          >
            <Marker
              latitude={this.state.lat}
              longitude={this.state.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon1}`} />{" "}
            </Marker>
            <Marker
              latitude={this.props.matchLat}
              longitude={this.props.matchLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon2}`} />{" "}
            </Marker>
            {this.state.allVenues.map((item, index) => {
              let icon;
              console.log("selectedidx", this.props.selectedIdx, "idx", index);
              this.props.selectedIdx === index
                ? (icon = `highlightedFooodMarker`)
                : (icon = `foodMarker`);
              return (
                <Marker
                  latitude={item.location.lat}
                  longitude={item.location.lng}
                  offsetLeft={-20}
                  offsetTop={-10}
                  key={item.id}
                >
                  ){" "}
                  <div
                    onClick={() => {
                      this.props.setSelectedIdx(index);
                    }}
                    className={icon}
                  />{" "}
                </Marker>
              );
            })}{" "}
          </MapGL>{" "}
        </div>{" "}
        <button className="chatBubble" onClick={this.handleOpenChat}>
          <i class="fas fa-comment-alt" />
        </button>{" "}
        <Chat />{" "}
        {this.state.loadedVenues && (
          <div className="overlay">
            <div className="content">
              <SwipeLayer allVenues={this.state.allVenues} />{" "}
            </div>{" "}
          </div>
        )}{" "}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    matchLat: state.userMatchLatLong.match[1],
    matchLong: state.userMatchLatLong.match[2],
    matchPreference: state.matchPreference,
    selectedIdx: state.selectedIdx,
    icon1: state.icon.icon1,
    icon2: state.icon.icon2
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserLatLong: arr => dispatch(setUserLatLong(arr)),
    getMatchLatLong: userId => dispatch(getMatchLatLong(userId)),
    getMatchPreference: userId => dispatch(getMatchPreference(userId)),
    setSelectedIdx: idx => dispatch(setSelectedIdx(idx)),
    joinChatRoom: () => dispatch(joinChatRoom()),
    setIconImg: () => dispatch(setIconImg())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapBox);
