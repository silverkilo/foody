import React, { Component } from "react";
import { connect } from "react-redux";
import { disconnectChat } from "../store/chat";
import "./finalpage.css";

class FinalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="finalContainer">
        <button
          onClick={() => {
            this.props.disconnectChat();
            this.props.history.push("/preference");
          }}
          className="finalButton"
        >
          I'm done. <br /> Take me back!
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
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
