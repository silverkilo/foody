import React, { Component } from "react";
import { connect } from "react-redux";
import { updateUserThunk, logout } from "../store";
import { withRouter } from "react-router-dom";

class SignupPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  handleLogOut() {
    this.props.logout();
    this.props.history.push("/");
  }
  async handleSubmit(event) {
    try {
      event.preventDefault();
      const userInfo = {
        password: event.target.password.value
      };
      const userId = this.props.user.id;
      await this.props.updateUserThunk(userId, userInfo);
      this.props.history.push("/welcome");
    } catch (error) {
      this.setState({
        error
      });
    }
  }

  render() {
    return (
      <div className="email page">
        <h1 className="email__title">Create a Password</h1>
        <form
          className="email__form"
          name="signup"
          onSubmit={this.handleSubmit}
        >
          <input
            name="password"
            className="email__input"
            type="password"
            placeholder="Password"
          />
          <button className="email__button" type="submit">
            Next
          </button>
        </form>
        <div className="email__footer">
          <p>
            Already have an account?{" "}
            <button
              className="email__footer__link"
              onClick={() => this.handleLogOut()}
            >
              Sign In.
            </button>
          </p>
        </div>
      </div>
    );
  }
}

const mapState = state => {
  return {
    error: state.user.error,
    user: state.user
  };
};

const mapDispatch = dispatch => {
  return {
    updateUserThunk: (userId, userInfo) =>
      dispatch(updateUserThunk(userId, userInfo)),
    logout: () => dispatch(logout())
  };
};

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(SignupPassword)
);
