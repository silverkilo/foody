import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Route, Switch } from 'react-router-dom'


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
  UserPreference
} from './components'
import { me, createConnection, errorListener, potentialMatchesListener, getPotentialMatches, didMatchListener } from './store'


class Routes extends Component {
  componentDidMount() {
    this.props.me()

  }
  componentDidUpdate() {
    if (this.props.user && this.props.user.id) {
      this.props.createConnection()
      this.props.errorListener()
      this.props.potentialMatchesListener()
      this.props.getPotentialMatches()
      console.log(this.props.didMatchListener)
      this.props.didMatchListener()
    }
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

const mapStateToProps = ({ user }) => ({ user })

export default withRouter(
  connect(
    mapStateToProps,
    { me, createConnection, errorListener, potentialMatchesListener, getPotentialMatches, didMatchListener }
  )(Routes)
)
