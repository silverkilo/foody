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
  disconnectListener,
  matchListeners,
  chatListener,
  resListener,
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
    preventPullToRefresh("#root");
    this.props.me(() => {
      window.navigator.geolocation.getCurrentPosition(
        this.props.postLocation,
        err => console.log(err),
        {
          timeout: 10000,
          enableHighAccuracy: false,
          maximumAge: 10000
        }
      );
      this.props.createConnection();
      this.props.disconnectListener();
      this.props.readyToListen(() => {
        this.props.matchListeners();
        this.props.chatListener();
        this.props.resListener();
      });
    });
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />{" "}
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
      disconnectListener,
      matchListeners,
      readyToListen,
      chatListener,
      postLocation,
      resListener
    }
  )(Routes)
);
