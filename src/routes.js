import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'

import {
  Login,
  Signup,
  SignupEmail,
  SignupName,
  SignupPassword,
  Welcome,
  AuthForm,
  UserProfile,
  UpdateUser,
  Preference,
  Matching,
  Map,
  FoodPlaces,
  UserPreference
} from './components'

import {me} from './store'

class Routes extends Component {
  componentDidMount() {
    this.props.me()
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/signup-email" component={SignupEmail} />
        <Route path="/signup-name" component={SignupName} />
        <Route path="/signup-password" component={SignupPassword} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/authform" component={AuthForm} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/editProfile" component={UpdateUser} />
        <Route path="/preference" component={Preference} />
        <Route path="/matches" component={Matching} />
        <Route path="/map" component={Map} />
      </Switch>
    )
  }
}

export default withRouter(
  connect(
    null,
    {me}
  )(Routes)
)
