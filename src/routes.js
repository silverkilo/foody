import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Route, Switch } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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
  MapBox,
  FinalPage,
  NavigationTest
} from "./components";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevDepth: this.getPathDepth(this.props.location)
    };
  }
  componentWillReceiveProps() {
    this.setState({ prevDepth: this.getPathDepth(this.props.location) });
  }
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

    if (this.props.matched) {
      if (
        this.props.location.pathname === "/preference" ||
        this.props.location.pathname === "/"
      ) {
        this.props.history.push("/matches");
      }
    } else if (
      this.props.user &&
      this.props.user.id &&
      this.props.location.pathname === "/"
    ) {
      this.props.history.push("/preference");
    }
  }
  componentDidUpdate() {
    if (
      ["/matches", "/map", "/navigation"].includes(this.props.location.pathname)
    ) {
      document.querySelector("html").style.position = "fixed";
      document.querySelector("body").style.position = "fixed";
    } else {
      document.querySelector("html").style.position = "";
      document.querySelector("body").style.position = "";
    }
  }
  getPathDepth(location) {
    let pathArr = location.pathname.split("/");
    pathArr = pathArr.filter(n => n !== "");
    return pathArr.length;
  }
  render() {
    const currentKey = this.props.location.pathname.split("/")[1] || "/";
    return (
      <TransitionGroup component="div">
        <CSSTransition
          key={currentKey}
          timeout={300}
          classNames="pageSlider"
          mountOnEnter={false}
          unmountOnExit={true}
        >
          <div
            className={
              this.getPathDepth(this.props.location) - this.state.prevDepth >= 0
                ? "left"
                : "right"
            }
          >
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Login initSocket={() => this.props.initSocket()} />
                )}
              />{" "}
              <Route path="/signup" component={Signup} />{" "}
              <Route
                path="/signup-email"
                render={() => (
                  <SignupEmail initSocket={() => this.props.initSocket()} />
                )}
              />{" "}
              <Route path="/signup-name" component={SignupName} />{" "}
              <Route path="/signup-password" component={SignupPassword} />{" "}
              <Route path="/welcome" component={Welcome} />{" "}
              <Route path="/profile" component={UserProfile} />{" "}
              <Route path="/preference" component={Preference} />{" "}
              <Route path="/matches" component={Matching} />{" "}
              <Route path="/map" component={MapBox} />{" "}
              <Route path="/navigation" component={NavigationTest} />{" "}
              <Route path="/finalpage" component={FinalPage} />{" "}
            </Switch>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}

const mapStateToProps = ({
  user,
  match: {
    didMatch: { matched }
  }
}) => ({
  user,
  matched
});

export default withRouter(connect(mapStateToProps)(Routes));
