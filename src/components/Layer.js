import React, {Component} from 'react';
import ReactSwipe from 'react-swipe';
import './mapstyles.css'
import { connect } from 'react-redux';
import {FoodDetails} from './FoodDetails'
import {setFood} from '../store/food'

export class SwipeLayer extends Component {
  constructor(props) {
    super(props)
    this.checkYes = this.checkYes.bind(this)
  }

  checkYes(venueId) {
    // change the background color and pin color when selected
    // notify the other user when you select that food
    console.log('selected', venueId)
    this.props.pickFoodPlace(venueId)
  }

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
                  <button onClick={() => this.checkYes(venue.id)}>pick me!</button>
                </div>)
            )}
          </ReactSwipe>
          <button onClick={() => reactSwipeEl.next()}>Next</button>
          <button onClick={() => reactSwipeEl.prev()}>Previous</button>
        </div>
    )
  }
}

export const mapStateToProps = state => {
  return {
    food: state.food
  }
}

export const mapDispatchToProps = dispatch => {
  return {
    pickFoodPlace: restaurantId => dispatch(setFood(restaurantId)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SwipeLayer)
