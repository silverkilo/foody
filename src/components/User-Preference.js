import React, { Component } from "react";
import { connect } from "react-redux";
import { removePreference } from "../store";

class UserPreference extends Component {
  constructor(props) {
    super(props);
    this.handleRemove = this.handleRemove.bind(this);
  }
  handleRemove(preference) {
    this.props.removePreference(preference);
  }
  render() {
    return (
      <React.Fragment>
        {this.props.preferences.map(preference => {
          return (
            <button
              className="food"
              type="button"
              key={preference.id}
              onClick={() => this.handleRemove(preference)}
            >
              <i className="fas fa-times-circle" />
              <h1 className="food__text">{preference.category}</h1>
            </button>
          );
        })}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    preferences: state.preferences
  };
};
const mapDispatchToProps = dispatch => {
  return {
    removePreference: preference => dispatch(removePreference(preference))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPreference);
