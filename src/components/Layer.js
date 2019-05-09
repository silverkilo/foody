import React, { Component } from "react";
import ReactSwipe from "react-swipe";
import "./mapstyles.css";
import { connect } from "react-redux";
import { FoodDetails } from "./FoodDetails";
import { setFood } from "../store/food";
const customStyles = {
  container: {
    overflow: "hidden",
    visibility: "hidden",
    position: "relative",
    width: "100%",
    background: "none"
  },
  wrapper: {
    overflow: "hidden",
    position: "relative",
    background: "none"
  },
  child: {
    float: "left",
    width: "100%",
    height: "100%",
    position: "relative",
    transitionProperty: "transform",
    background: "none",
    color: "black"
  }
};
export class SwipeLayer extends Component {
  constructor(props) {
    super(props);
    this.checkYes = this.checkYes.bind(this);
  }

  checkYes(venueId) {
    // change the background color and pin color when selected
    // notify the other user when you select that food
    console.log("selected", venueId);
    this.props.pickFoodPlace(venueId);
  }

  render() {
    let reactSwipeEl;
    console.log("all Venues", this.props.allVenues);
    return (
      <React.Fragment>
        <ReactSwipe
          swipeOptions={{ continuous: true }}
          ref={el => (reactSwipeEl = el)}
          childCount={this.props.allVenues.length}
          style={customStyles}
        >
          {this.props.allVenues.map(venue => (
            <div key={venue.id}>
              <FoodDetails venueId={venue.id} />
              {!this.props.food.includes(venue.id) && (
                <button onClick={() => this.checkYes(venue.id)}>
                  pick me!
                </button>
              )}
            </div>
          ))}
        </ReactSwipe>
      </React.Fragment>
    );
  }
}

export const mapStateToProps = state => {
  return {
    food: state.food
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    pickFoodPlace: restaurantId => dispatch(setFood(restaurantId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipeLayer);
