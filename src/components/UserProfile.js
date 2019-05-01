import React, { Component } from 'react'
import {me} from '../store/user'
import { connect } from 'tls';

class UserProfile extends Component {
  render() {
    return (
      <div>
        <div>
          <h1>Hello {this.props.user.firstName}!</h1>
        </div>

        <div>
          <h3>{this.props.user.email}</h3>
        </div>
      </div>
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
    getUser: (userId) => dispatch(me(userId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile)
