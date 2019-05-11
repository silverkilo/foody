import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";

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
  Map
} from "./components";
import {
  me,
  createConnection,
  disconnectListener,
  matchListeners,
  chatListener,
  readyToListen
} from "./store";

class Routes extends Component {
  componentDidMount() {
    this.props.me(() => {
      this.props.createConnection();
      this.props.disconnectListener();
      this.props.readyToListen(() => {
        this.props.matchListeners();
        this.props.chatListener();
      });
    });
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
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default withRouter(
  connect(
    mapStateToProps,
    {
      me,
      createConnection,
      disconnectListener,
      matchListeners,
      readyToListen,
      chatListener
    }
  )(Routes)
);
