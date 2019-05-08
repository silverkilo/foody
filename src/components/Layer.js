import React, {Component} from 'react';
import ReactSwipe from 'react-swipe';
import {FoodDetails} from './FoodDetails'

export class SwipeLayer extends Component {
  render() {
    let reactSwipeEl;
    return (
      this.props.loadedVenues &&
        <div>
          <ReactSwipe
            swipeOptions={{ continuous: true }}
            ref={el => (reactSwipeEl = el)}
            childCount={this.props.allVenues.length}
          >
            {this.props.allVenues.map(venue => (
                <div key={venue.id}>
                  {/* <FoodDetails venueId={venue.id}/> */}
                  <h1>HI</h1>
                  <button>Yes</button>
                  <button>No</button>
                </div>)
            )}
          </ReactSwipe>
          <button onClick={() => reactSwipeEl.next()}>Next</button>
          <button onClick={() => reactSwipeEl.prev()}>Previous</button>
        </div>
    )
  }
}
