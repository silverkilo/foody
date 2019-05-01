import React, { Component } from 'react'
import { connect } from 'react-redux';
import { updateUserPreference } from '../store/user';
const categories = [
  'All',
  'African',
  'American',
  'Japanese',
  'Chinese',
  'Malaysian',
  'Vietnamese',
  'Australian',
  'Brazilian',
  'Burmese',
  'Cajun',
  'Dessert',
  'French',
  'Bakery',
  'German',
  'Greek',
  'Persian',
  'Peruvian',
  'Vegan',
  'Vegetarian'
]

class Preference extends Component {
  render() {
    return (
      <div>

        <div>
            <span> What type of food are you feeling today? </span>
        </div>

        <div>
          <select defaultValue={categories[0]}
          onChange={evt => this.props.updatePreference(id, evt.target.value)
                                  .catch(err => this.setState({isErr: true}))}>
              {categories.map(
                val => (
                  <option key={val} value={val}> {val} </option>
                )
              )}
          </select>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePreference: (id, pref) => dispatch(updateUserPreference(id, pref))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preference)
