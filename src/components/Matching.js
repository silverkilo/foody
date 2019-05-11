import React, { Component } from "react";
import { connect } from "react-redux";
import { swipe } from "../store";
class Matching extends Component {
  componentDidMount() {
    this.props.swipe();
  }
  render() {
    if (this.props.didMatch.matched) {
      const match = this.props.didMatch.info;
      return (
        <div>
          <h2>Congrats, you matched with</h2>
          <div key={match.id}>
            <p>{match.firstName}</p>
            <p>{match.lastName}</p>
            <img src={match.photoURLs[0]} alt={match.firstName} />
            <p>{match.preferences.join(", ")}</p>
          </div>
        </div>
      );
    }
    if (!this.props.potentials.length) return <div>No Matches to show</div>;

    const user = this.props.potentials[0];
    return (
      <div className="match-container">
        <div className="match-card" key={user.id}>
          <h1 className="match-name">
            {user.firstName} {user.lastName}
          </h1>

          <div className="match-image">
            <img src={user.photoURLs[0]} alt={user.firstName} />
          </div>

          {/* match distance will be deleted, for debugging purposes only */}
          <strong className="match-distance">{user.distance}</strong>
          <p className="match-prefs">{user.preferences.join(", ")}</p>
          <div className="match-buttons">
            <button
              className="match-button-left"
              onClick={() => this.props.swipe(false, user.id, user.match)}
            >
              Left
            </button>
            <button
              className="match-button-right"
              onClick={() => this.props.swipe(true, user.id, user.match)}
            >
              Right
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ match }) => ({
  ...match
});

export default connect(
  mapStateToProps,
  { swipe }
)(Matching);
