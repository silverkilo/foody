import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import { connect } from "react-redux";
import "./mapstyles.css";
import axios from "axios";
import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import "./mapstyles.css";
import t from "typy";
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
  height: 600,
  width: 500,
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
      coordinatesLoaded: false,
      name: "",
      address: "",
      city: "",
      state: "",
      price: "",
      currency: "",
      rating: "",
      categories: "",
      photo: "",
      restaurantLat: "",
      restaurantLong: ""
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
      name: t(venue, "name").safeObject,
      address: t(venue, "location.address").safeObject,
      city: t(venue, "location.city").safeObject,
      state: t(venue, "location.state").safeObject,
      price: t(venue, "price.tier").safeObject,
      currency: t(venue, "price.currency").safeObject,
      rating: t(venue, "rating").safeObject,
      categories: t(venue, "categories[0].shortName").safeObject,
      photo: t(venue, "bestPhoto").safeObject,
      restaurantLat: venue.location.lat,
      restaurantLong: venue.location.lng
    });
  };

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/${
      this.props.userLong
    },${this.props.userLat};${this.state.restaurantLong},${
      this.state.restaurantLat
    }?geometries=geojson&access_token=pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA`;
    const res = await axios.get(endpoint);
    data[0].path = res.data.routes[0].geometry.coordinates;
    this.setState({
      coordinatesLoaded: true
    });
  };

  createStars = () => {
    const rating = Math.round(this.state.rating / 2);
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
    const price = this.state.price;
    const currency = this.state.currency;
    for (let i = 0; i < price; i++) {
      signs += currency;
    }
    return signs;
  };

  clickedHere = () => {
    this.props.history.push("/finalpage");
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
          {this.state.coordinatesLoaded && (
            <DeckGL
              height={600}
              width={500}
              initialViewState={initialViewState}
              layers={layer}
              controller={true}
            >
              {/* )}{" "} */}
              <MapGL
                mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
                mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
              >
                <Marker
                  latitude={this.props.userLat}
                  longitude={this.props.userLong}
                  offsetLeft={-20}
                  offsetTop={-10}
                >
                  <div className={`marker marker1`} />
                </Marker>
                <Marker
                  latitude={this.state.restaurantLat}
                  longitude={this.state.restaurantLong}
                  offsetLeft={-20}
                  offsetTop={-10}
                >
                  <div className={`foodMarker`} />{" "}
                </Marker>
              </MapGL>
            </DeckGL>
          )}
          <div className="detailsTemp">
            <div>Restaurant Details</div>
            <ul className="card__details">
              <li className="card__name">{this.state.name}</li>
              <li className="card__rating">{this.createStars()}</li>
              <li className="card__price">
                {this.createCurrency()} {this.state.category}
              </li>
              <li className="card__address">{this.state.address}</li>
              <li className="card__address">
                {this.state.city}, {this.state.state}
              </li>
            </ul>
            <button className="hereButton" onClick={() => this.clickedHere()}>
              I 'm here!
            </button>
          </div>
        </div>
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
