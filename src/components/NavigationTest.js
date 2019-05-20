import React from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PathLayer, IconLayer } from "@deck.gl/layers";
import axios from "axios";
import { connect } from "react-redux";
import Nav from "./Nav";

let data = [
  {
    name: "fake-name",
    color: [101, 147, 245],
    path: [
      // [-74.00578, 40.713067],
      // [-74.004577, 40.712425],
      // [-74.003626, 40.71365],
      // [-74.002666, 40.714243],
      // [-74.002136, 40.715177],
      // [-73.998493, 40.713452],
      // [-73.997981, 40.713673],
      // [-73.997586, 40.713448],
      // [-73.99256, 40.713863]
    ]
  }
];

export class NavigationTest extends React.Component {
  state = {
    loadedData: false
    // restaurantLong: -73.977712,
    // restaurantLat: 40.731873,
    // name: "",
    // address: "",
    // city: "",
    // state: "",
    // price: "",
    // currency: "",
    // rating: "",
    // categories: "",
    // photo: ""
  };

  async componentDidMount() {
    // await this.getRestaurantCoords();
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

  // getRestaurantCoords = async () => {
  //   const venueId = this.props.selectedRestaurant;
  //   // const venueId = "412d2800f964a520df0c1fe3";
  //   const params = {
  //     client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
  //     client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
  //     v: "20130619"
  //   };
  //   const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?&client_id=${
  //     params.client_id
  //   }&client_secret=${params.client_secret}&v=${params.v}`;

  //   const res = await axios.get(venuesEndpoint);
  //   console.log(res);
  //   const { venue } = res.data.response;
  //   this.setState({
  //     name: t(venue, "name").safeObject,
  //     address: t(venue, "location.address").safeObject,
  //     city: t(venue, "location.city").safeObject,
  //     state: t(venue, "location.state").safeObject,
  //     price: t(venue, "price.tier").safeObject,
  //     currency: t(venue, "price.currency").safeObject,
  //     rating: t(venue, "rating").safeObject,
  //     categories: t(venue, "categories[0].shortName").safeObject,
  //     photo: t(venue, "bestPhoto").safeObject,
  //     restaurantLat: venue.location.lat,
  //     restaurantLong: venue.location.lng
  //   });
  //   // this.setState({
  //   //   loadedData: true
  //   // });
  //   console.log("this.state.restaurantLat", this.state.restaurantLat);
  // };

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/${
      this.props.userLong
    },${this.props.userLat};${this.props.restaurantLong},${
      this.props.restaurantLat
    }?geometries=geojson&access_token=pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA`;
    const res = await axios.get(endpoint);
    console.log("GEOJSON", res);
    data[0].path = res.data.routes[0].geometry.coordinates;
    this.setState({
      loadedData: true
    });
  };

  createStars = () => {
    const rating = Math.round(this.props.rating / 2);
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
    const price = this.props.price;
    const currency = this.props.currency;
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
        getWidth: data => 7,
        getColor: data => data.color,
        widthMinPixels: 7
      }),
      new IconLayer({
        id: "restaurant-layer",
        data: [
          {
            position: [this.props.restaurantLong, this.props.restaurantLat],
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
            position: [this.props.userLong, this.props.userLat],
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

    return this.state.loadedData ? (
      <React.Fragment>
        <Nav />
        <div className="page">
          <DeckGL
            initialViewState={{
              longitude: -74.006,
              latitude: 40.7128,
              zoom: 12
            }}
            height="100%"
            width="100%"
            controller={true}
            layers={layer}
          >
            <StaticMap
              mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
              mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
            />
          </DeckGL>{" "}
          <React.Fragment>
            <div className="overlay">
              <div className="content">
                <div className="card">
                  {" "}
                  {this.props.photo !== undefined ? (
                    <img
                      className="card__img"
                      src={
                        this.props.photo.prefix +
                        "200x200" +
                        this.props.photo.suffix
                      }
                      alt=""
                    />
                  ) : (
                    <img
                      className="card__img"
                      src="./images/stock.jpg"
                      alt=""
                    />
                  )}{" "}
                  <ul className="card__details">
                    <li className="card__name"> {this.props.name} </li>{" "}
                    <li className="card__rating"> {this.createStars()} </li>{" "}
                    <li className="card__price">
                      {" "}
                      {this.createCurrency()} {this.props.categories}{" "}
                    </li>{" "}
                    <li className="card__address"> {this.props.address} </li>{" "}
                    <li className="card__address">
                      {" "}
                      {this.props.city}, {this.props.state}{" "}
                    </li>{" "}
                  </ul>{" "}
                  <button
                    className="card__button"
                    onClick={() => {
                      this.clickedHere();
                    }}
                  >
                    Here!{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </React.Fragment>{" "}
        </div>{" "}
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
    selectedRestaurant: state.selectedRestaurant,
    name: state.venueDetails.name,
    address: state.venueDetails.address,
    city: state.venueDetails.city,
    state: state.venueDetails.state,
    price: state.venueDetails.price,
    currency: state.venueDetails.currency,
    rating: state.venueDetails.rating,
    categories: state.venueDetails.categories,
    photo: state.venueDetails.photo,
    restaurantLat: state.venueDetails.restaurantLat,
    restaurantLong: state.venueDetails.restaurantLong
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationTest);
