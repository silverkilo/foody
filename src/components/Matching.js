import React, { Component } from "react";
import { connect } from "react-redux";
import MatchStack from "./MatchStack";
import { swipe } from "../store";
import NewMatch from "./NewMatch";
import NoMatches from "./NoMatches";
class Matching extends Component {
  componentDidMount() {
    this.props.swipe();
  }

  componentDidUpdate() {
    if (this.props.didMatch.matched) {
      setTimeout(() => {
        this.props.history.push("/map");
      }, 1000);
    }
  }

  render() {
    if (this.props.didMatch.matched) {
      const match = this.props.didMatch.info;
      return <NewMatch {...match} />;
    }
    if (!this.props.potentials.length) return <NoMatches />;
    const users = this.props.potentials;
    return (
      <div className="match-container">
        {this.props.loading ? null : <MatchStack users={users} />}
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
