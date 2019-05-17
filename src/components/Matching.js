import React, { Component } from "react";
import { connect } from "react-redux";
import MatchStack from "./MatchStack";
import { swipe, getPotentialMatches } from "../store";
import ReactModal from "react-modal";
import NoMatches from "./NoMatches";
import Nav from "./Nav";

class Matching extends Component {
  async componentDidMount() {
    if (this.props.didMatch.matched) {
      console.log("MATCHED");
      setTimeout(() => {
        this.props.history.push("/map");
      }, 3000);
    } else {
      await this.props.getPotentialMatches();
    }
  }
  componentDidUpdate() {
    if (this.props.didMatch.matched) {
      console.log("MATCHED");
      setTimeout(() => {
        this.props.history.push("/map");
      }, 3000);
    }
  }
  render() {
    // if (this.props.didMatch.matched) {
    //   const match = this.props.didMatch.info;
    //   return <NewMatch {...match} />;
    // }
    const users = this.props.potentials;

    return (
      <React.Fragment>
        <Nav />
        <div className="match-container page">
          {" "}
          {this.props.loading ? null : <MatchStack users={users} />}{" "}
        </div>{" "}
        {this.props.didMatch.matched ? (
          <ReactModal
            isOpen={this.props.didMatch.matched ? true : false}
            shouldCloseOnOverlayClick={true}
            closeTimeoutMS={5000}
            contentLabel="Restaurant Selected Modal"
            className="congrats__content"
            overlayClassName="congrats__overlay"
            // style={{ overlay: {}, content: "hi is this working" }}
            // portalClassName="ReactModalPortal"
            // overlayClassName="ReactModal__Overlay"
            // className="ReactModal__Content"
            // bodyOpenClassName="ReactModal__Body--open"
            // htmlOpenClassName="ReactModal__Html--open"
            // ariaHideApp={true}
            // role="dialog"
            // parentSelector={() => document.body}
            // data={{
            //   background: "blue"
            // }}
          >
            <i className="fas fa-user-friends congrats__icon" />
            <h1 className="congrats__title"> Congratulations! </h1>{" "}
            <div>
              <p className="congrats__text">
                You have matched with {this.props.didMatch.info.firstName}{" "}
                {this.props.didMatch.info.lastName}{" "}
              </p>{" "}
              <img
                className="congrats__img"
                src={this.props.didMatch.info.photoURLs[0]}
                alt={this.props.didMatch.info.firstName}
              />{" "}
            </div>{" "}
          </ReactModal>
        ) : null}{" "}
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ match }) => ({
  ...match
});

export default connect(
  mapStateToProps,
  {
    swipe,
    getPotentialMatches
  }
)(Matching);
