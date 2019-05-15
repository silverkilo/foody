import React, { Component } from "react";
import { connect } from "react-redux";
import { select, deselect } from "../store/food";
import t from "typy";
import axios from "axios";

class FoodDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      city: "",
      state: "",
      price: "",
      currency: "",
      rating: "",
      categories: "",
      photo: "",
      card: "card"
    };
  }

  componentDidMount() {
    this.getVenuesDetails();
  }

  getVenuesDetails = async () => {
    const venueId = this.props.venueId;
    const params = {
      client_id: "5DQ4HC1WROBOH0SFRD4IULDTPLLRP4J5LWKMOG0SZ0LRV5K0",
      client_secret: "E5PLXEXQKZMQMPU02YDTSV0I1ZIAFK5LI0KPAEEZUCQQ5OJ3",
      v: "20130619"
    };
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?&client_id=${
      params.client_id
    }&client_secret=${params.client_secret}&v=${params.v}`;

    const res = await axios.get(venuesEndpoint);
    const { venue } = res.data.response;
    console.log(venue);
    this.setState({
      name: t(venue, "name").safeObject,
      address: t(venue, "location.address").safeObject,
      city: t(venue, "location.city").safeObject,
      state: t(venue, "location.state").safeObject,
      price: t(venue, "price.tier").safeObject,
      currency: t(venue, "price.currency").safeObject,
      rating: t(venue, "rating").safeObject,
      categories: t(venue, "categories[0].shortName").safeObject,
      photo: t(venue, "bestPhoto").safeObject
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

  render() {
    return (
      <div className={this.state.card}>
        {this.state.photo !== undefined ? (
          <img
            className="card__img"
            src={this.state.photo.prefix + "200x200" + this.state.photo.suffix}
            alt=""
          />
        ) : (
          <img className="card__img" src="./images/stock.jpg" alt="" />
        )}
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
