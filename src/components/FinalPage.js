import React, { Component } from "react";
import { connect } from "react-redux";
import { disconnectChat } from "../store/chat";
import "./finalpage.css";
import Nav from "./Nav";

class FinalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props);
    return (
      <React.Fragment>
        <Nav />
        <div className="final">
          <img className="final__img" src={this.props.match.photoURLs} alt="" />
          <div className="final__social">
            <i className="fab fa-instagram" />
            <i className="fab fa-facebook-square" />
            <i className="fab fa-linkedin" />
          </div>
          <h1 className="final__text">Please rate your food buddy!</h1>
          <div className="final__stars">
            <div className="star__wrapper">
              <i className="fas fa-star final__star" />
            </div>
            <div className="star__wrapper">
              <i className="fas fa-star final__star" />
            </div>
            <div className="star__wrapper">
              <i className="fas fa-star final__star" />
            </div>
            <div className="star__wrapper">
              <i className="fas fa-star final__star" />
            </div>
            <div className="star__wrapper">
              <i className="fas fa-star final__star" />
            </div>
          </div>
          <form className="final__form">
            <textarea className="final__comment" />
            <button
              type="button"
              className="final__submit"
              onClick={() => {
                this.props.disconnectChat();
                this.props.history.push("/preference");
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </React.Fragment>
      // <div className="finalContainer">
      //   <button
      //     onClick={() => {
      //       this.props.disconnectChat();
      //       this.props.history.push("/preference");
      //     }}
      //     className="finalButton"
      //   >
      //     I'm done. <br /> Take me back!
      //   </button>
      // </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    match: state.match.didMatch.info
  };
};
const mapDispatchToProps = dispatch => {
  return {
    disconnectChat: () => dispatch(disconnectChat())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FinalPage);
