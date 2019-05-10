import React, { Component } from "react";
import ReactSwipe, { reactSwipeEl } from "react-swipe";
import "./mapstyles.css";
import { connect } from "react-redux";
import { FoodDetails } from "./FoodDetails";
import { setSelectedIdx } from "../store/highlight";
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
  }

  checkYes = venueId => {
    // change the background color and pin color when selected
    // notify the other user when you select that food
    console.log("selected", venueId);
    this.props.pickFoodPlace(venueId);
  };

  render() {
    let reactSwipeEl;
    return (
      <div>
        <ReactSwipe
          swipeOptions={{
            startSlide: this.props.selectedIdx,
            continuous: true,
            callback: (idx, ele) => {
              this.props.setSelectedIdx(idx);
              ele.setAttribute("data-index", this.props.selectedIdx);
            }
          }}
          ref={element => {
            reactSwipeEl = element;
          }}
          childCount={this.props.allVenues.length}
          style={customStyles}
        >
          {this.props.allVenues.map((venue, idx) => (
            <div key={venue.id}>
              <FoodDetails venueId={venue.id} />
              {!this.props.food.includes(venue.id) && (
                <button
                  onClick={() => {
                    this.checkYes(venue.id);
                  }}
                >
                  pick me!
                </button>
              )}
            </div>
          ))}
        </ReactSwipe>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  return {
    food: state.food,
    selectedIdx: state.selectedIdx
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    pickFoodPlace: restaurantId => dispatch(setFood(restaurantId)),
    setSelectedIdx: idx => dispatch(setSelectedIdx(idx))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipeLayer);
