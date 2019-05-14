import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import SwipeLayer from "./SwipeLayer";
import { connect } from "react-redux";
import { setUserLocation, getMatchLocation } from "../store";
import { setSelectedIdx } from "../store/highlight";
import { getMatchPreference } from "../store/matchPreference";
import { joinChatRoom } from "../store/chat";
import { setIconImg } from "../store/icon";
import Chat from "./Chat";
import "./mapstyles.css";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// }

// function randomIcon() {
//   return Math.floor(Math.random() * 8) + 1;
// }

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
      // venuesUser: [],
      // venuesMatch: [],
      allVenues: [],
      // THE BELOW MATCH PREFERENCES JUST HAS SOME PLACEHOLDER PREFERENCES FOR TESTING
      matchPreferences: [
        "Food Truck",
        "Supermarket",
        "Food Stand",
        "Asian Restaurant"
      ],
      loadedVenues: false,
      loadedUser: false
    };
    this.getLoc = null;
  }

  async componentDidMount() {
    this.getLoc = new Promise((resolve, reject) => {
      let lat = this.props.userLat;
      let long = this.props.userLong;
      resolve([long, lat]);
      this.setState(
        {
          viewport: {
            ...this.state.viewport,
            latitude: lat,
            longitude: long
          },
          lat,
          long,
          loadedUser: true
        },
        resolve
      );
    });
    this.props.setIconImg();

    const [long, lat] = await this.getLoc;
    let distance = Math.sqrt(
      (lat - this.props.matchLat) ** 2 + (long - this.props.matchLong) ** 2
    );
    console.log("DISTANCE", distance);
    let midpointLat = (lat + this.props.matchLat) / 2;
    let midpointLong = (long + this.props.matchLong) / 2;

    await this.getVenues(midpointLat, midpointLong, 600);
    console.log(this.props.matchInfo);
    this.props.getMatchLocation();
    this.props.joinChatRoom();
    this.setState(
      {
        matchPreferences: this.props.matchInfo
          ? this.props.matchInfo.preferences
          : this.state.matchPreferences
      },
      () => {
        console.log(this.state);
      }
    );
  }

  getVenues = async (lat, long, radius) => {
    const venuesEndpoint = "https://api.foursquare.com/v2/venues/search?";

    const params = {
      client_id: "KUZ0H02M1VQNYUNKV40GFCICQUYGHRZJQVFLFS4MK01IHFYE",
      client_secret: "ESQTWW5FJSPUDTTCM5JWQ1EO3T1GXNRVMS5XTKR3AKC4GNVJ",
      limit: 5,
      query: "Food",
      v: "20130619", // version of the API
      ll: `${lat}, ${long}`,
      radius
    };

    await fetch(venuesEndpoint + new URLSearchParams(params), {
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
        this.setState({
          allVenues: filtered
        });
      });
    this.setState({
      loadedVenues: true
    });
  };

  //chat functions
  handleOpenChat = () => {
    let chat = document.querySelector(".chatBox");
    chat.classList.add("is-visible");
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
        </button>
        <Chat />
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
    userLat: state.location.user[1],
    userLong: state.location.user[0],
    matchLat: state.location.match[1],
    matchLong: state.location.match[0],
    matchInfo: state.match.didMatch.info,
    selectedIdx: state.selectedIdx,
    icon1: state.icon.icon1,
    icon2: state.icon.icon2
  };
};

export default connect(
  mapStateToProps,
  {
    setUserLocation,
    getMatchLocation,
    getMatchPreference,
    setSelectedIdx,
    joinChatRoom,
    setIconImg
  }
)(MapBox);
