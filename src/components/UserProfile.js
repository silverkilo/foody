import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserThunk, logout } from "../store/user";
import Nav from "./Nav";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      currentPage: "profile"
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.id !== this.props.user.id) {
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
  handleSubmit = event => {
    event.preventDefault();
    this.props.update(this.props.user.id, this.state);
  };
  handleLogout = () => {
    this.props.logout();
    this.props.history.push("/");
  };
  handleBack = () => {
    this.props.history.goBack();
  };
  handleUpload = () => {
    alert("how?");
  };

  render() {
    return (
      <React.Fragment>
        <Nav currentPage={this.state.currentPage} />
        <div className="profile">
          <div className="profile__photo">
            <h1 className="profile__title">Profile Picture</h1>
            <p className="profile__text">
              Upload a recent photo of yourself. This helps everyone find a
              great match.
            </p>
            <i className="fas fa-user-circle profile__img" />
            <button
              className="profile__upload"
              type="button"
              onClick={() => this.handleUpload()}
            >
              Upload
            </button>
          </div>
          <div className="profile__details">
            <h1 className="profile__title">Details</h1>
            <p className="profile__text">Keep your information up-to-date.</p>
            <div className="profile__container">
              <form className="profile__list" onSubmit={this.handleSubmit}>
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
          <div className="profile__actions">
            <button
              className="profile__logout"
              type="button"
              onClick={() => this.handleLogout()}
            >
              Log Out
            </button>
          </div>
        </div>
      </React.Fragment>
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
    update: (id, user) => dispatch(updateUserThunk(id, user)),
    logout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
