import React, { Component } from "react";
import ReactSwipe from "react-swipe";
import "./mapstyles.css";
import { connect } from "react-redux";
import FoodDetails from "./FoodDetails";
import { setSelectedIdx } from "../store/highlight";

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
    color: "black",
    border: "none",
    outline: "none"
  }
};

export class SwipeLayer extends Component {
  render() {
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
          childCount={this.props.allVenues.length}
          style={customStyles}
        >
          {this.props.allVenues.map((venue, idx) => (
            <div key={venue.id}>
              <FoodDetails venueId={venue.id} />
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
    setSelectedIdx: idx => dispatch(setSelectedIdx(idx))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwipeLayer);
