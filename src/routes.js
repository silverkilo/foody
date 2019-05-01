import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {Login, UserProfile} from './components'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path='/profile' component={UserProfile} />
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
