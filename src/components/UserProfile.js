import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserThunk, logout } from "../store/user";
import Nav from "./Nav";
import UploadPhoto from "./UploadPhoto";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      currentPage: "profile",
      editingPhoto: false,
      photoURL: null,
      image: null
    };
  }

  componentDidMount() {
    this.setState({
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      email: this.props.email,
      photoURL: this.props.photoURLs ? this.props.photoURLs[0] : null
    });
  }
  setPreviewImage(image) {
    if (image) {
      this.setState({ image: URL.createObjectURL(image) });
    } else {
      this.setState({ image: "/static/user_image.png" });
    }
  }
  cancelEdit(image) {
    this.setState({
      editingPhoto: false,
      image: null
    });
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
    this.setState({
      editingPhoto: true
    });
  };

  render() {
    return (
      <React.Fragment>
        <Nav currentPage={this.state.currentPage} />
        <div className="profile page page2">
          <div className="profile__photo">
            <h1 className="profile__title">Profile Picture</h1>
            <p className="profile__text">
              Upload a recent photo of yourself. This helps everyone find a
              great match.
            </p>
            {/* <i className="fas fa-user-circle profile__img" /> */}
            <img
              src={this.state.image || this.state.photoURL}
              alt={this.state.firstName}
              className="profile__img"
            />
            {this.state.editingPhoto && (
              <UploadPhoto
                original={this.props.photoURLs[0]}
                setPreviewImage={this.setPreviewImage.bind(this)}
              />
            )}
            <button
              className="profile__upload"
              type="button"
              onClick={() =>
                this.state.editingPhoto
                  ? this.cancelEdit()
                  : this.handleUpload()
              }
            >
              {this.state.editingPhoto ? "Cancel" : "Upload"}
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

const mapStateToProps = ({ user }) => ({ ...user });
const mapDispatchToProps = (dispatch, props) => {
  return {
    update: (id, user) => dispatch(updateUserThunk(id, user)),
    logout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
