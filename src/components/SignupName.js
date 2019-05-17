import React, { Component } from "react";
import { connect } from "react-redux";
import { updateUserThunk, logout } from "../store";
import { withRouter } from "react-router-dom";

class SignupName extends Component {
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
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value
      };
      const userId = this.props.user.id;
      await this.props.updateUserThunk(userId, userInfo);
      if (this.props.user.firstName && this.props.user.lastName) {
        this.props.history.push("/signup-password");
      }
    } catch (error) {
      this.setState({
        error
      });
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="email page">
        <h1 className="email__title">Add Your Name</h1>
        <form
          className="email__form"
          name="signup"
          onSubmit={this.handleSubmit}
        >
          <input
            name="firstName"
            className="email__input"
            type="text"
            placeholder="First Name"
          />
          <input
            name="lastName"
            className="email__input"
            type="text"
            placeholder="Last Name"
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
  )(SignupName)
);
