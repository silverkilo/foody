import React, { Component } from "react";
import { connect } from "react-redux";
import MatchStack from "./MatchStack";
import { swipe } from "../store";
import ReactModal from "react-modal";
import NewMatch from "./NewMatch";
import NoMatches from "./NoMatches";
import Nav from "./Nav";

class Matching extends Component {
  componentDidMount() {
    if (this.props.didMatch.matched) {
      console.log("MATCHED");
      setTimeout(() => {
        this.props.history.push("/map");
      }, 3000);
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
    if (!this.props.potentials.length) return <NoMatches />;
    const users = this.props.potentials;

    return (
      <React.Fragment>
        <Nav />
        <div className="match-container">
          {this.props.loading ? null : <MatchStack users={users} />}
        </div>
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
          <i className="fas fa-utensils congrats__icon" />
          <h1 className="congrats__title"> Congratulations! </h1>{" "}
          <div key={this.props.didMatch.info.id}>
            <p className="congrats__text">
              You have matched with {this.props.didMatch.info.firstName}{" "}
              {this.props.didMatch.info.lastName}
            </p>
            <img
              src={this.props.didMatch.info.photoURLs[0]}
              alt={this.props.didMatch.info.firstName}
            />
          </div>
        </ReactModal>
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
