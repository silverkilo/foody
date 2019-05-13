import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import { connect } from "react-redux";
import { setUserLatLong, getMatchLatLong } from "../store/location";
import { setSelectedIdx } from "../store/highlight";
import { getMatchPreference } from "../store/matchPreference";
import { joinChatRoom } from "../store/chat";
import Chat from "./Chat";
import "./mapstyles.css";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// }

export class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        width: "100%",
        height: "40vh",
        latitude: this.props.userLat,
        longitude: this.props.userLat,
        zoom: 14
      },
      showChat: false
    };
  }

  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation);
    this.props.getMatchLatLong(this.props.userId);
  }

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
    this.props.setUserLatLong([this.state.lat, this.state.long]);
  };

  getRestaurantLocation = () => {
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
    this.props.setUserLatLong([this.state.lat, this.state.long]);
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
              <div className={`marker marker${this.props.icon1}`} />
            </Marker>
            <Marker
              latitude={this.props.matchLat}
              longitude={this.props.matchLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon2}`} />
            </Marker>
            })}
          </MapGL>
        </div>
        <button className="chatBubble" onClick={this.handleOpenChat}>
          <i class="fas fa-comment-alt" />
        </button>
        <Chat />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    userLat: state.userMatchLatLong.user[0],
    userLong: state.userMatchLatLong.user[1],
    matchLat: state.userMatchLatLong.match[0],
    matchLong: state.userMatchLatLong.match[1],
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
    joinChatRoom: () => dispatch(joinChatRoom())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
