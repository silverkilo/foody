import React, { Component } from "react";
import { connect } from "react-redux";
import { select, deselect } from "../store/food";

class FoodDetails extends Component {
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
      categories: "",
      card: "card"
    };
  }

  componentDidMount() {
    this.getVenuesDetails();
    // this.getVenuesPhoto();
  }

  getVenuesDetails = () => {
    const venueId = this.props.venueId;
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?`;

    const params = {
      client_id: "5DQ4HC1WROBOH0SFRD4IULDTPLLRP4J5LWKMOG0SZ0LRV5K0",
      client_secret: "E5PLXEXQKZMQMPU02YDTSV0I1ZIAFK5LI0KPAEEZUCQQ5OJ3",
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
  };

  getVenuesPhoto = () => {
    const venueId = this.props.venueId;
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}/photos?`;

    const params = {
      client_id: "KNZLRCLACQGMZEXF3KBCR3XNLOL3NSYCAZVMMOC43FEI3KDA",
      client_secret: "31RKGQ323YRWSTTZLRIN1YCAG2BV2CR12NEXNLJGO4GS1YHI",
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
  };

  handleSelect = venueId => {
    this.props.select(venueId);
    this.setState({
      card: "card selectedCard"
    });
  };
  handleDeselect = venueId => {
    this.props.deselect(venueId);
    this.setState({
      card: "card"
    });
  };
  createStars = () => {
    if (this.state.rating === "n/a") {
      return "Rating Not Available";
    }
    const rating = Math.round(this.state.rating / 2);
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<i class="fas fa-star" />);
    }
    return stars;
  };
  render() {
    return (
      <div className={this.state.card}>
        {/* <img
          src={this.state.photoPrefix + "100x100" + this.state.photoSuffix}
          alt=""
        /> */}
        <img className="card__img" src="./images/stock.jpg" alt="" />
        <ul className="card__details">
          <li className="card__name">{this.state.name}</li>
          <li className="card__rating">
            {this.createStars()} {this.state.category}
          </li>
          <li className="card__address">{this.state.address}</li>
          <li className="card__address">
            {this.state.city}, {this.state.state}
          </li>
        </ul>
        {this.props.food.includes(this.props.venueId) ? (
          <button
            className="card__button"
            onClick={() => {
              this.handleDeselect(this.props.venueId);
            }}
          >
            Remove
          </button>
        ) : (
          <button
            className="card__button"
            onClick={() => {
              this.handleSelect(this.props.venueId);
            }}
          >
            pick me!
          </button>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    food: state.food
  };
};
const mapDispatchToProps = dispatch => {
  return {
    select: restaurantId => dispatch(select(restaurantId)),
    deselect: restaurantId => dispatch(deselect(restaurantId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FoodDetails);
