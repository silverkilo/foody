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
  UserProfile,
  Preference,
  Matching,
  MapBox
} from "./components";
import {
  me,
  createConnection,
  matchListeners,
  chatListener,
  readyToListen,
  postLocation
} from "./store";

class Routes extends Component {
  componentDidMount() {
    // disable pull to refresh for chrome IOS. Enabled for two fingers
    function preventPullToRefresh(element) {
      let prevent = false;
      document
        .querySelector(element)
        .addEventListener("touchstart", function(e) {
          if (e.touches.length !== 1) {
            return;
          }

          const scrollY =
            window.pageYOffset ||
            document.body.scrollTop ||
            document.documentElement.scrollTop;
          prevent = scrollY === 0;
        });

      document
        .querySelector(element)
        .addEventListener("touchmove", function(e) {
          if (prevent) {
            prevent = false;
            e.preventDefault();
          }
        });
    }

    preventPullToRefresh("html");
    preventPullToRefresh("body");
  }
  componentDidUpdate() {
    if (this.props.location.pathname === "/matches") {
      document.querySelector("html").style.position = "fixed";
      document.querySelector("body").style.position = "fixed";
    } else {
      document.querySelector("html").style.position = "static";
      document.querySelector("body").style.position = "static";
    }
  }

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={() => <Login initSocket={() => this.props.initSocket()} />}
        />{" "}
        <Route path="/signup" component={Signup} />{" "}
        <Route path="/signup-email" component={SignupEmail} />{" "}
        <Route path="/signup-name" component={SignupName} />{" "}
        <Route path="/signup-password" component={SignupPassword} />{" "}
        <Route path="/welcome" component={Welcome} />{" "}
        <Route path="/profile" component={UserProfile} />{" "}
        <Route path="/preference" component={Preference} />{" "}
        <Route path="/matches" component={Matching} />{" "}
        <Route path="/map" component={MapBox} />{" "}
      </Switch>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default withRouter(
  connect(
    mapStateToProps,
    {
      me,
      createConnection,
      matchListeners,
      readyToListen,
      chatListener,
      postLocation
    }
  )(Routes)
);
