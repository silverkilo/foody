import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
// import { Link } from "react-router-dom";
import ReactModal from "react-modal";
import SwipeLayer from "./SwipeLayer";
import { connect } from "react-redux";
import { setUserLocation, getMatchLocation } from "../store";
import { setSelectedIdx } from "../store/highlight";
import { getMatchPreference } from "../store/matchPreference";
import { joinChatRoom, clearUnread } from "../store/chat";
import { createVenueList } from "../store/food";
import { setIconImg } from "../store/icon";
import Chat from "./Chat";
import "./mapstyles.css";
import Nav from "./Nav";
import t from "typy";

// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
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
      matchPreferences: [],
      loadedVenues: false,
      loadedUser: false,
      selectedRestaurant: {}
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

    const [long, lat] = await this.getLoc;
    let distance =
      Math.sqrt(
        (lat - this.props.matchLat) ** 2 + (long - this.props.matchLong) ** 2
      ) * 111000;
    let midpointLat = (lat + this.props.matchLat) / 2;
    let midpointLong = (long + this.props.matchLong) / 2;
    console.log("DISTANCE", distance);
    console.log("LOC", midpointLat, midpointLong);
    this.props.joinChatRoom();
    this.props.setIconImg();
    this.props.createVenueList();
    this.setState(
      {
        matchPreferences: this.props.matchInfo
          ? this.props.matchInfo.preferences
          : this.state.matchPreferences
      },
      async () => {
        console.log("STATE AFTER SETTING MATCH PREFERENCES", this.state);
        console.log("this.props.matchInfo", this.props.matchInfo);
        await this.getVenues(
          midpointLat,
          midpointLong,
          distance > 500 ? distance : 500
        );
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.userLat !== this.state.lat ||
      this.props.userLong !== this.state.long
    ) {
      this.setState({
        lat: this.props.userLat,
        long: this.props.userLong,
        viewport: {
          ...this.state.viewport,
          latitude: this.props.userLat,
          longitude: this.props.userLong
        }
      });
    }
    if (prevProps.selectedRestaurant !== this.props.selectedRestaurant) {
      let selected = this.state.allVenues.filter(
        venue => venue.id === this.props.selectedRestaurant
      );
      console.log("venues", this.state.allVenues);
      console.log("selected", selected);
      this.setState({
        selectedRestaurant: {
          name: t(selected[0], "name").safeObject,
          address: t(selected[0], "location.address").safeObject,
          city: t(selected[0], "location.city").safeObject,
          state: t(selected[0], "location.state").safeObject,
          price: t(selected[0], "price.tier").safeObject,
          currency: t(selected[0], "price.currency").safeObject,
          rating: t(selected[0], "rating").safeObject,
          categories: t(selected[0], "categories[0].shortName").safeObject,
          photo: t(selected[0], "bestPhoto").safeObject
        }
      });
    }
  }

  getVenues = async (lat, long, radius) => {
    console.log("RADIUS", radius);
    const venuesEndpoint = "https://api.foursquare.com/v2/venues/search?";

    const params = {
      client_id: "5DQ4HC1WROBOH0SFRD4IULDTPLLRP4J5LWKMOG0SZ0LRV5K0",
      client_secret: "E5PLXEXQKZMQMPU02YDTSV0I1ZIAFK5LI0KPAEEZUCQQ5OJ3",
      limit: 30,
      v: "20130619", // version of the API
      intent: "browse",
      ll: `${lat}, ${long}`,
      radius,
      categoryId: this.state.matchPreferences.join(",")
      // + ",4d4b7105d754a06374d81259"
    };

    await fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        // filter out those places without category names
        console.log(response);
        this.setState({
          allVenues: response.response.venues,
          loadedVenues: true
        });
      });
  };

  //chat functions
  handleOpenChat = () => {
    let chat = document.querySelector(".chatBox");
    chat.classList.add("is-visible");
    this.props.clearUnread();
  };

  handlePopupClose = () => {
    this.props.history.push("/navigation");
  };
  createStars = () => {
    const rating = Math.round(this.state.selectedRestaurant.rating / 2);
    let stars = [
      <i className="fas fa-star empty" />,
      <i className="fas fa-star empty" />,
      <i className="fas fa-star empty" />,
      <i className="fas fa-star empty" />,
      <i className="fas fa-star empty" />
    ];
    for (let i = 0; i < rating; i++) {
      stars[i] = <i className="fas fa-star" />;
    }
    return stars;
  };

  createCurrency = () => {
    let signs = "";
    const price = this.state.selectedRestaurant.price;
    const currency = this.state.selectedRestaurant.currency;
    for (let i = 0; i < price; i++) {
      signs += currency;
    }
    return signs;
  };
  render() {
    return (
      <React.Fragment>
        <Nav />
        <div className="map">
          <MapGL
            {...this.state.viewport}
            mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
            onViewportChange={viewport =>
              this.setState({
                viewport
              })
            }
            mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
          >
            <Marker
              latitude={this.props.userLat}
              longitude={this.props.userLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon1}`} />{" "}
            </Marker>{" "}
            <Marker
              latitude={this.props.matchLat}
              longitude={this.props.matchLong}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div className={`marker marker${this.props.icon2}`} />{" "}
            </Marker>{" "}
            {this.state.allVenues.map((item, index) => {
              let icon;
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
        {this.props.unreadMsg > 0 ? <button> UNREAD MSG </button> : null}
        <Chat />
        {this.state.loadedVenues && (
          <div className="overlay">
            <div className="content">
              <SwipeLayer allVenues={this.state.allVenues} />{" "}
            </div>{" "}
          </div>
        )}{" "}
        <ReactModal
          isOpen={this.props.selectedRestaurant ? true : false}
          shouldCloseOnOverlayClick={true}
          closeTimeoutMS={5000}
          contentLabel="Restaurant Selected Modal"
          className="congrats__content"
          overlayClassName="congrats__overlay"
          // style={{ overlay: {}, content: "hi is this working" }}
          // portalClassName="ReactModalPortal"
          // overlayClassName="ReactModal__Overlay"
          // className="ReactModal__Content"
          // bodyOpenClassName="ReactModal__Body--open"
          // htmlOpenClassName="ReactModal__Html--open"
          // ariaHideApp={true}
          // role="dialog"
          // parentSelector={() => document.body}
          // data={{
          //   background: "blue"
          // }}
        >
          <i className="fas fa-utensils congrats__icon" />
          <h1 className="congrats__title"> Congratulations! </h1>{" "}
          <p className="congrats__text">
            You have both selected {this.state.selectedRestaurant.name}{" "}
          </p>{" "}
          <span className="congrats__text"> {this.createStars()} </span>{" "}
          {this.createCurrency() !== "" ? (
            <span className="congrats__text"> {this.createCurrency()} </span>
          ) : (
            ""
          )}{" "}
          <span className="congrats__text">
            {" "}
            {this.state.selectedRestaurant.address}{" "}
          </span>{" "}
          <span className="congrats__text">
            {" "}
            {this.state.selectedRestaurant.city},{" "}
            {this.state.selectedRestaurant.state}{" "}
          </span>{" "}
          <button
            className="congrats__button"
            onClick={() => {
              this.handlePopupClose();
            }}
          >
            Lets Go!
          </button>{" "}
        </ReactModal>{" "}
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
    icon2: state.icon.icon2,
    selectedRestaurant: state.selectedRestaurant,
    unreadMsg: state.unreadMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserLocation: arr => dispatch(setUserLocation(arr)),
    getMatchLocation: userId => dispatch(getMatchLocation(userId)),
    getMatchPreference: userId => dispatch(getMatchPreference(userId)),
    setSelectedIdx: idx => dispatch(setSelectedIdx(idx)),
    joinChatRoom: () => dispatch(joinChatRoom()),
    setIconImg: () => dispatch(setIconImg()),
    createVenueList: () => dispatch(createVenueList()),
    clearUnread: () => dispatch(clearUnread())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapBox);
