import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {AuthForm, UserProfile, UpdateUser} from './components'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={AuthForm} />
        <Route path='/profile' component={UserProfile} />
        <Route path='/editProfile' component={UpdateUser} />
      </Switch>
    )
  }
}

export default withRouter(
  connect(
    null,
    null
  )(Routes)
)
