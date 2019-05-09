import React, { Component } from "react";
import ReactSwipe from "react-swipe";
import "./mapstyles.css";
import { FoodDetails } from "./FoodDetails";
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
  constructor() {
    super();
    // this.checkYes = this.checkYes.bind(this)
    this.state = {
      foodStyle: "unselectedFoodPlace"
    };
  }

  // checkYes() {
  //   // change the background color and pin color when selected
  //   console.log('selected!')
  //   this.setState({
  //     foodStyle: 'selectedFoodPlace'
  //   })
  // }

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
              <div className="card">
                {/* <FoodDetails venueId={venue.id}/> */}
                <h1>HI</h1>
                <button onClick={() => this.checkYes()}>Yes!</button>
              </div>
            </div>
          ))}
        </ReactSwipe>
      </React.Fragment>
    );
  }
}
