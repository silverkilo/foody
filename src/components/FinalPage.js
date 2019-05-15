import React, { Component } from "react";
import { connect } from "react-redux";
import { disconnectChat } from "../store/chat";

class FinalPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.disconnectChat();
            this.props.history.push("/preference");
          }}
        >
          I'm done with the meal!
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
