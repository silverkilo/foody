import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../store";

class Nav extends Component {
  handleProfile = () => {
    this.props.history.push("/profile");
  };

  render() {
    return (
      <header className="header">
        <div />
        <h1 className="header__title">Foody</h1>
        <button
          className="logout"
          type="button"
          onClick={() => this.handleProfile()}
        >
          <i className="fas fa-cog" />
        </button>
      </header>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Nav)
);
