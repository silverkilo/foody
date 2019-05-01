import React, { Component } from 'react'
import {me} from '../store/user'
import {connect} from 'react-redux';

export const UserProfile = props => {
  const {user} = props

    return (
      <div>
        <div>
          <h1>Hello {user.firstName} {user.lastName}!</h1>
        </div>

        <div>
          <h3>Email: {user.email}</h3>
        </div>
      </div>
    )
}

const mapStateToProps = state => {
  return {
    user: state
  }
}

export default connect(mapStateToProps)(UserProfile)
