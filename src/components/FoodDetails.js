import React, { Component } from "react";

export class FoodDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      price: "n/a",
      address: "",
      city: "",
      state: "",
      rating: "n/a",
      photoPrefix: "",
      photoSuffix: "",
      photoWidth: "",
      photoHeight: "",
      categories: ""
    };
    this.getVenuesDetails = this.getVenuesDetails.bind(this);
    this.getVenuesPhoto = this.getVenuesPhoto.bind(this);
  }

  componentDidMount() {
    this.getVenuesDetails();
    this.getVenuesPhoto();
  }

  getVenuesDetails() {
    const venueId = this.props.venueId;
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?`;

    const params = {
      client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
      client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
      v: "20130619"
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        console.log("ADDITIONAL DETAILS", response.response.venue);
        this.setState({
          name: response.response.venue.name,
          address: response.response.venue.location.address,
          city: response.response.venue.location.city,
          state: response.response.venue.location.state
        });

        if (
          response.response.venue.price !== undefined &&
          response.response.venue.price.message !== undefined
        ) {
          this.setState({
            price: response.response.venue.price.message
          });
        }

        if (response.response.venue.rating !== undefined) {
          this.setState({
            rating: response.response.venue.rating
          });
        }

        if (response.response.venue.categories[0] !== undefined) {
          this.setState({
            categories: response.response.venue.categories[0].name
          });
        }
      });
  }

  getVenuesPhoto() {
    const venueId = this.props.venueId;
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos?`;

    const params = {
      client_id: "NX3GZUE1WIRAGVIIW3IEPTA0XJBBHQXMV3FW4NN44X3JMYYJ",
      client_secret: "YJQZYGOBGSRRMLW0FZNNCFFXANTEB0HUVEXPTSBIA2BNOOGM",
      v: "20130619"
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: "GET"
    })
      .then(response => response.json())
      .then(response => {
        console.log("ADDITIONAL PHOTOS", response.response.photos);
        if (
          response.response.photos.items !== undefined &&
          response.response.photos.items.length > 0
        ) {
          this.setState({
            photoPrefix: response.response.photos.items[0].prefix,
            photoSuffix: response.response.photos.items[0].suffix,
            photoWidth: response.response.photos.items[0].width,
            photoHeight: response.response.photos.items[0].height
          });
        }
      });
  }

  render() {
    return (
      <div className="card">
        <img
          src={this.state.photoPrefix + "100x100" + this.state.photoSuffix}
          alt=""
        />
        <h2>{this.state.name}</h2>
        <h2>{this.state.address}</h2>
        <h2>
          {this.state.city}, {this.state.state}
        </h2>
        <h2>Category: {this.state.categories}</h2>
        <h2>Price: {this.state.price}</h2>
        <h2>Rating: {this.state.rating}</h2>
      </div>
    );
  }
}
