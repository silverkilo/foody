import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getAllCategories } from '../store/categories';
import { sendUserPreference } from '../store/preferences';

class Preference extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  async reload() {
    this.setState({loaded: false})
    await this.props
      .getAllCategories()
      .then(() =>
        this.setState({
          loaded: true
        })
      )
  }

  componentDidMount() {
    this.reload()
  }

  componentDidUpdate(prevState) {
    if (
      prevState === this.props.categories
    ) {
      this.reload()
    }
  }

  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>
    }
    return (
      <div>

        <div>
            <span> What type of food are you feeling today? </span>
        </div>

        <div>
          <select defaultValue={this.categories[0]}
          onChange={evt => this.props.updatePreference([...evt.target.selectedOptions].map(x=> x.value))}>
              {this.props.categories.map(
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
    getAllCategories: () => dispatch(getAllCategories()),
    updatePreference: (id, pref) => dispatch(sendUserPreference(id, pref))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preference)
