import React, { Component } from "react";
import { connect } from "react-redux";
import MatchStack from "./MatchStack";
import { swipe } from "../store";
import NewMatch from "./NewMatch";
import NoMatches from "./NoMatches";
import Nav from "./Nav";

class Matching extends Component {
  componentDidMount() {
    // if (this.props.didMatch.matched) {
    //   console.log("MATCHED");
    //   setTimeout(() => {
    //     this.props.history.push("/map");
    //   }, Infinity);
    // }
  }
  componentDidUpdate() {
    // if (this.props.didMatch.matched) {
    //   console.log("MATCHED");
    //   setTimeout(() => {
    //     this.props.history.push("/map");
    //   }, Infinity);
    // }
  }
  render() {
    if (this.props.didMatch.matched) {
      const match = this.props.didMatch.info;
      return <NewMatch {...match} />;
    }
    if (!this.props.potentials.length) return <NoMatches />;
    const users = this.props.potentials;

    return (
      <React.Fragment>
        <Nav />
        <div className="match-container">
          {this.props.loading ? null : <MatchStack users={users} />}
        </div>
      </React.Fragment>
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
