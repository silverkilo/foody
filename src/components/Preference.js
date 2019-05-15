import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getAllCategories,
  sendUserPreference,
  logout,
  addPreference,
  swipe
} from "../store";
import UserPreference from "./User-Preference";
import Nav from "./Nav";

class Preference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      selected: []
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.formatPreferences = this.formatPreferences.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  componentDidUpdate(prevState) {
    if (prevState === this.props.categories) {
      this.reload();
    }
  }

  async reload() {
    this.setState({ loaded: false });
    await this.props.getAllCategories().then(() =>
      this.setState({
        loaded: true
      })
    );
  }

  handleSelect(preference) {
    this.props.addPreference(preference);
  }

  formatPreferences(preferences) {
    let prefIds = [];
    for (let preference of preferences) {
      prefIds.push(preference.id);
    }
    return prefIds;
  }

  handleClick() {
    const preferences = this.formatPreferences(this.props.preferences);
    this.props.sendUserPreference(this.props.user.id, preferences, () => {
      this.props.swipe();
      this.props.history.push("/matches");
    });
  }

  render() {
    if (!this.state.loaded) {
      return <h1>Loading...</h1>;
    }
    return (
      <React.Fragment>
        <Nav />
        <div className="preference">
          <div className="preference__selection">
            <h1 className="preference__text">
              What type of food are you feeling today?
            </h1>
            <UserPreference />
          </div>
          <div className="preference__list">
            {this.props.categories.map(category => {
              return (
                <button
                  className="preference__button"
                  type="button"
                  key={category.id}
                  onClick={() => this.handleSelect(category)}
                >
                  {category.category}
                </button>
              );
            })}
          </div>
          {this.props.preferences.length > 0 ? (
            <button
              className="match"
              type="button"
              onClick={() => this.handleClick()}
            >
              <i className="fas fa-users" />
            </button>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    user: state.user,
    preferences: state.preferences,
    matched: state.match.didMatch.matched
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCategories: () => dispatch(getAllCategories()),
    sendUserPreference: (id, pref, callback) =>
      dispatch(sendUserPreference(id, pref, callback)),
    logout: () => dispatch(logout()),
    addPreference: preference => dispatch(addPreference(preference)),
    swipe: () => dispatch(swipe())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preference);
