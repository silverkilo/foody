import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import { connect } from "react-redux";
import "./mapstyles.css";
import axios from "axios";
import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import "./mapstyles.css";
// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// };

let data = [
  {
    // name: "fake-name",
    color: [0, 0, 255],
    path: []
  }
];

const initialViewState = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 14
  // pitch: 0,
  // bearing: 0
};

export class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 14,
        pitch: 0,
        bearing: 0
      },
      restaurantLat: "",
      restaurantLong: "",
      coordinatesLoaded: false
    };
  }

  async componentDidMount() {
    this.getRestaurantCoords();
  }

  componentDidUpdate() {
    if (
      this.props.userLat !== this.state.viewport.latitude ||
      this.props.userLong !== this.state.viewport.longitude
    ) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          latitude: this.props.userLat,
          longitude: this.props.userLong
        }
      });
    }
    this.getCoordinates();
  }

  getRestaurantCoords = async () => {
    // const venueId = this.props.selectedRestaurant;

    // BELOW ID IS FOR TEST. COMMENT BACK IN ABOVE LINE AND DELETE BELOW LINE
    const venueId = "412d2800f964a520df0c1fe3";
    const params = {
      client_id: "KUZ0H02M1VQNYUNKV40GFCICQUYGHRZJQVFLFS4MK01IHFYE",
      client_secret: "ESQTWW5FJSPUDTTCM5JWQ1EO3T1GXNRVMS5XTKR3AKC4GNVJ",
      v: "20130619"
    };
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?&client_id=${
      params.client_id
    }&client_secret=${params.client_secret}&v=${params.v}`;

    const res = await axios.get(venuesEndpoint);
    const { venue } = res.data.response;
    this.setState({
      name: venue.name,
      restaurantLat: venue.location.lat,
      restaurantLong: venue.location.lng
    });
  };

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/${
      this.state.viewport.longitude
    },${this.state.viewport.latitude};${this.state.restaurantLong},${
      this.state.restaurantLat
    }?geometries=geojson&access_token=pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg`;
    const res = await axios.get(endpoint);
    data[0].path = res.data.routes[0].geometry.coordinates;
    this.setState({
      coordinatesLoaded: true
    });
  };

  clickedHere = () => {
    console.log("here!");
  };

  render() {
    const layer = [
      new PathLayer({
        id: "path-layer",
        data,
        getWidth: data => 3,
        getColor: data => data.color,
        widthMinPixels: 5
      })
    ];

    return (
      <React.Fragment>
        <div className="map">
          {" "}
          {this.state.coordinatesLoaded &&
            <DeckGL
              initialViewState={initialViewState}
              layers={layer}
              controller={true}
            >
          {/* )}{" "} */}
          <MapGL
                      mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
                      mapboxApiAccessToken="pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg"
                    >
                      <Marker
                        latitude={this.props.userLat}
                        longitude={this.props.userLong}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <div className={`marker marker1`} />
                      </Marker>
                      {/* <Marker
                        latitude={dummyResData[1]}
                        longitude={dummyResData[0]}
                        offsetLeft={-20}
                        offsetTop={-10}
                      >
                        <div className={`marker marker2`} />{" "}
                      </Marker> */}
                      }) }
                    </MapGL>
                  </DeckGL>
                }
          {/* <button className="hereButton" onClick={() => this.clickedHere()}>
            I 'm here!{" "}
          </button>{" "} */}
        </div>{" "}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userLong: state.location.user[0],
    userLat: state.location.user[1],
    icon1: state.icon.icon1,
    icon2: state.icon.icon2,
    selectedRestaurant: state.selectedRestaurant
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
