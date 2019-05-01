import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {AuthForm, UserProfile, UpdateUser, Preference} from './components'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={AuthForm} />
        <Route path='/profile' component={UserProfile} />
        <Route path='/editProfile' component={UpdateUser} />
        <Route path='/preference' component={Preference} />
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
