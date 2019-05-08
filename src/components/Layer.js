import React, {Component} from 'react';
import ReactSwipe from 'react-swipe';
import './mapstyles.css'
import {FoodDetails} from './FoodDetails'

export class SwipeLayer extends Component {
  constructor() {
    super()
    this.checkYes = this.checkYes.bind(this)
    this.state = {
      foodStyle: 'unselectedFoodPlace'
    }
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
    return (
        <div className='unselectedFoodPlace'>
          <ReactSwipe
            swipeOptions={{ continuous: true }}
            ref={el => (reactSwipeEl = el)}
            childCount={this.props.allVenues.length}
          >
            {this.props.allVenues.map(venue => (
                <div key={venue.id}>
                  {/* <FoodDetails venueId={venue.id}/> */}
                  <h1>HI</h1>
                  <button onClick={() => this.checkYes()}>Yes!</button>
                </div>)
            )}
          </ReactSwipe>
          <button onClick={() => reactSwipeEl.next()}>Next</button>
          <button onClick={() => reactSwipeEl.prev()}>Previous</button>
        </div>
    )
  }
}
