import React, { Component } from "react";
import { connect } from "react-redux";
import MatchCards from "./MatchCards";
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

    const users = this.props.potentials.reverse();
    return (
      <div className="match-container">
        <MatchCards users={users} />
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
