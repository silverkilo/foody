import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class Nav extends Component {
  handleProfile = () => {
    this.props.history.push("/profile");
  };
  handleBack = () => {
    this.props.history.goBack();
  };
  render() {
    return (
      <header className="header">
        {this.props.currentPage !== undefined ? (
          <button
            className="back__button"
            type="button"
            onClick={() => this.handleBack()}
          >
            <i className="fas fa-arrow-circle-left" />
          </button>
        ) : (
          <button
            className="settings"
            type="button"
            onClick={() => this.handleProfile()}
          >
            <i className="fas fa-cog" />
          </button>
        )}
        <h1 className="header__title">Foody</h1>
        <div />
      </header>
    );
  }
}

export default withRouter(
  connect(
    null,
    null
  )(Nav)
);
