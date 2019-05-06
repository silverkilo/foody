import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {AuthForm, UserProfile, UpdateUser, Preference, Matching, Map, FoodPlaces} from './components'
import {me} from './store'

class Routes extends Component {

  componentDidMount() {
    this.props.me()
  }

  render() {
    return (
      <Switch>
        <Route path="/login" component={AuthForm} />
        <Route path='/profile' component={UserProfile} />
        <Route path='/editProfile' component={UpdateUser} />
        <Route path='/preference' component={Preference} />
        <Route path='/matches' component={Matching} />
        <Route path='/map' component={Map} />
        <Route path='/food' component={FoodPlaces} />

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
