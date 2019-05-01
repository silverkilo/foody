import React, {Component} from 'react'
import {connect} from 'react-redux'
import {updateUserThunk} from '../store/user'

class UpdateUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  static getDerivedStateFromProps(props) {
    return {
      firstName: props.user.firstName,
      lastName: props.user.lastName,
      email: props.user.email,
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    alert('Changes submitted!')
    this.props.update(this.props.user.id, this.state)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            onChange={this.handleChange}
            value={this.state.firstName || ''}
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            onChange={this.handleChange}
            value={this.state.lastName || ''}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="text"
            name="email"
            onChange={this.handleChange}
            value={this.state.email || ''}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state
  }
}

const mapDispatchToProps = dispatch => {
  return {
    update: (id, user) => dispatch(updateUserThunk(id, user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUser)
