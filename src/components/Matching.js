import React, { Component } from "react";
import { connect } from "react-redux";
import { swipe } from "../store";
class Matching extends Component {
  render() {
    console.log(this.props.didMatch);
    if (this.props.didMatch.matched) {
      const match = this.props.didMatch.info;
      return (
        <div>
          <h2>Congrats, you matched with</h2>
          <div key={match.id}>
            <p>{match.firstName}</p>
            <p>{match.lastName}</p>
            <p>{match.preferences.join(", ")}</p>
          </div>
        </div>
      );
    }
    if (!this.props.potentials.length) return <div>No Matches to show</div>;

    const user = this.props.potentials[0];
    return (
      <div>
        <div key={user.id}>
          <h1>
            {user.firstName} {user.lastName}
          </h1>

          <p>{user.preferences.join(", ")}</p>
        </div>
        <button onClick={() => this.props.swipe(false, user.id)}>Left</button>
        <button onClick={() => this.props.swipe(true, user.id)}>Right</button>
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
