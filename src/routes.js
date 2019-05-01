import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {AuthForm} from './components'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route path="/login" component={AuthForm} />
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
