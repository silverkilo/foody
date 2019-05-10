import React, { Component } from "react";
import { connect } from "react-redux";

function handleClose() {
  let chat = document.querySelector(".chatBox");
  chat.classList.remove("is-visible");
}

export class Chat extends Component {
  constructor() {
    super();
  }

  componenetDidMount() {}
  render() {
    return (
      <div className="chatBox">
        <div className="chatBox__inside">
          <div className="chatBox__header">
            <h1>Chat</h1>
            <button onClick={() => handleClose()}>
              <i class="fas fa-times" />
            </button>
          </div>
          <div className="chatBox__body">
            <ul>
              {this.props.chatHistory.map(array => {
                let className;
                array[1] === this.props.userId
                  ? (className = "send")
                  : (className = "receiver");
                return <li className={className}>{array[0]}</li>;
              })}
            </ul>
          </div>
          <div className="chatBox__message">
            <form className="chatBox__form">
              <input
                className="chatBox__input"
                type="text"
                placeholder="Write your message"
              />
              <button className="chatBox__button" type="submit">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id,
    chatHistory: state.chatHistory
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
