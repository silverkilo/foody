import React from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PathLayer, IconLayer } from "@deck.gl/layers";
import axios from "axios";
import { connect } from "react-redux";
import t from "typy";

let data = [
  {
    name: "fake-name",
    color: [0, 0, 255],
    path: [
      // [-74.00578, 40.713067],
      // [-74.004577, 40.712425],
      // [-74.003626, 40.71365],
      // [-74.002666, 40.714243],
      // [-74.002136, 40.715177],
      // [-73.998493, 40.713452],
      // [-73.997981, 40.713673],
      // [-73.997586, 40.713448],
      // [-73.99256, 40.713863],
      // [-73.992637, 40.714706],
      // [-73.988995, 40.721608],
      // [-73.988487, 40.723418],
      // [-73.980869, 40.733895],
      // [-73.979701, 40.733362],
      // [-73.979628, 40.732848],
      // [-73.978613, 40.732169],
      // [-73.977585, 40.732152],
      // [-73.977876, 40.732047],
      // [-73.977712, 40.731873]
    ]
  }
];

const layer = [
  new PathLayer({
    id: "path-layer",
    data,
    getWidth: data => 2,
    getColor: data => data.color,
    widthMinPixels: 2
  }),
  new IconLayer({
    id: "restaurant-layer",
    data: [
      {
        position: [-73.977712, 40.731873],
        url: process.env.PUBLIC_URL + "/images/selectedFoodPin.png"
      }
    ],
    getIcon: data => ({
      url: data.url,
      width: 500,
      height: 500,
      anchorY: 500
    }),
    getSize: data =>
      Math.max(2, Math.min((data.contributions / 1000) * 25, 25)),
    pickable: true,
    sizeScale: 40,
    radiusMinPixels: 50,
    radiusMaxPixels: 800,
    visible: true
  }),
  new IconLayer({
    id: "currentLoc-layer",
    data: [
      {
        position: [-74.00578, 40.713067],
        url: process.env.PUBLIC_URL + "/images/currentLocation.png"
      }
    ],
    getIcon: data => ({
      url: data.url,
      width: 500,
      height: 500,
      anchorY: 250
    }),
    getSize: data =>
      Math.max(2, Math.min((data.contributions / 1000) * 25, 25)),
    pickable: true,
    sizeScale: 40,
    radiusMinPixels: 50,
    radiusMaxPixels: 800,
    visible: true
  })
];

export class NavigationTest extends React.Component {
  state = {
    loadedData: false,
    restaurantLong: "",
    restaurantLat: "",
    name: "",
    address: "",
    city: "",
    state: "",
    price: "",
    currency: "",
    rating: "",
    categories: "",
    photo: ""
  };

  async componentDidMount() {
    await this.getRestaurantCoords();
    await this.getCoordinates();
  }

  // componentDidUpdate() {
  //   if (
  //     this.props.userLat !== this.state.viewport.latitude ||
  //     this.props.userLong !== this.state.viewport.longitude
  //   ) {
  //     this.setState({
  //       viewport: {
  //         ...this.state.viewport,
  //         latitude: this.props.userLat,
  //         longitude: this.props.userLong
  //       }
  //     });
  //   }
  // }

  getRestaurantCoords = async () => {
    const venueId = this.props.selectedRestaurant;
    // console.log("restaurantId", venueId);
    // BELOW ID IS FOR TEST. COMMENT BACK IN ABOVE LINE AND DELETE BELOW LINE
    // const venueId = "412d2800f964a520df0c1fe3";
    const params = {
      client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
      client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
      v: "20130619"
    };
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?&client_id=${
      params.client_id
    }&client_secret=${params.client_secret}&v=${params.v}`;

    const res = await axios.get(venuesEndpoint);
    console.log(res);
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
    // this.setState({
    //   loadedData: true
    // });
    console.log("this.state.restaurantLat", this.state.restaurantLat);
  };

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/${
      this.props.userLong
    },${this.props.userLat};${this.state.restaurantLong},${
      this.state.restaurantLat
    }?geometries=geojson&access_token=pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA`;
    const res = await axios.get(endpoint);
    console.log("GEOJSON", res);
    data[0].path = res.data.routes[0].geometry.coordinates;
    this.setState({
      loadedData: true
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
    return this.state.loadedData ? (
      <React.Fragment>
        <DeckGL
          initialViewState={{
            longitude: -74.006,
            latitude: 40.7128,
            zoom: 12
          }}
          height={600}
          width={500}
          controller={true}
          layers={layer}
        >
          <StaticMap
            mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
            mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
          />
        </DeckGL>{" "}
        <React.Fragment>
          <div className="detailsTemp">
            <div> Restaurant Details </div>{" "}
            <ul className="card__details">
              <li className="card__name"> {this.state.name} </li>{" "}
              <li className="card__rating"> {this.createStars()} </li>{" "}
              <li className="card__price">
                {" "}
                {this.createCurrency()} {this.state.category}{" "}
              </li>{" "}
              <li className="card__address"> {this.state.address} </li>{" "}
              <li className="card__address">
                {" "}
                {this.state.city}, {this.state.state}{" "}
              </li>{" "}
            </ul>{" "}
            <button className="hereButton" onClick={() => this.clickedHere()}>
              I 'm here!{" "}
            </button>{" "}
          </div>
          ;{" "}
        </React.Fragment>{" "}
      </React.Fragment>
    ) : null;
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
)(NavigationTest);
