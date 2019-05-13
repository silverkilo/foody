import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserThunk } from "../store/user";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: ""
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.firstName !== this.props.user.firstName) {
      this.setState({
        firstName: this.props.user.firstName,
        lastName: this.props.user.lastName,
        email: this.props.user.email
      });
    }
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    return (
      <div className="profile">
        <div className="profile__photo">
          <h1 className="profile__title">Profile Picture</h1>
          <p className="profile__text">
            Upload a recent photo of yourself. This helps everyone find a great
            match.
          </p>
          <i className="fas fa-user-circle profile__img" />
        </div>
        <div className="profile__details">
          <h1 className="profile__title">Details</h1>
          <p className="profile__text">Keep your information up-to-date.</p>
          <div className="profile__container">
            <form className="profile__list">
              <input
                className="profile__input"
                type="text"
                name="firstName"
                onChange={this.handleChange}
                value={this.state.firstName}
                placeholder="First Name"
              />
              <input
                className="profile__input"
                type="text"
                name="lastName"
                onChange={this.handleChange}
                value={this.state.lastName}
                placeholder="Last Name"
              />
              <input
                className="profile__input"
                type="text"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
                placeholder="Email"
              />
              <button className="profile__submit" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    update: (id, user) => dispatch(updateUserThunk(id, user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
