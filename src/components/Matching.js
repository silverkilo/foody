import React, { Component } from "react";
import { connect } from "react-redux";
import MatchStack from "./MatchStack";
import { swipe } from "../store";
import NewMatch from "./NewMatch";
import NoMatches from "./NoMatches";
class Matching extends Component {
  componentDidMount() {
    this.props.swipe();
    document.querySelector("html").style.position = "fixed";
    document.querySelector("body").style.position = "fixed";
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
