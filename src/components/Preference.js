import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getAllCategories } from '../store/categories';
import { sendUserPreference } from '../store/preferences';

class Preference extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      selected: []
    }
  }

  async reload() {
    this.setState({ loaded: false })
    await this.props
      .getAllCategories()
      .then(() =>
        this.setState({
          loaded: true
        })
      )
  }

  handleChange(id) {
    this.setState({ selected: [...this.state.selected, id] })
  }

  handleClick() {
    this.props.sendUserPreference(this.props.user.id, this.state.selected)
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

        {/* <div>
          <select defaultValue={this.props.categories[0]}
          onChange={evt => this.props.sendUserPreference(this.props.user.id,[...evt.target.selectedOptions].map(x=> x.value))}>
              {this.props.categories.map(
                val => (
                  <option key={val} value={val}> {val} </option>
                )
              )}
          </select>
        </div> */}
        <div>
          {
            this.props.categories.map(({ id, category }) => {
              return (
                <li key={id} onClick={() => this.handleChange(id)} > {category} </li>
              )
            })
          }
        </div>
        <div>
          <button onClick={() => this.handleClick()}> Submit </button>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllCategories: () => dispatch(getAllCategories()),
    sendUserPreference: (id, pref) => dispatch(sendUserPreference(id, pref))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preference)
