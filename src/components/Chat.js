import React, { Component } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../store/chat";

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      loaded: false
    };
  }

  componentDidMount() {
    this.setState({
      loaded: true
    });
  }

  handleClose = () => {
    let chat = document.querySelector(".chatBox");
    chat.classList.remove("is-visible");
  };

  sendMsg = event => {
    event.preventDefault();
    this.props.sendMessage(this.state.message, this.props.userId);
    this.setState({
      message: ""
    });
  };

  render() {
    return (
      <div className="chatBox">
        <div className="chatBox__inside">
          <div className="chatBox__header">
            <h1> Chat </h1>
            <button onClick={() => this.handleClose()}>
              <i class="fas fa-times" />
            </button>
          </div>
          <div className="chatBox__body">
            <ul>
              {this.state.loaded &&
                this.props.chatHistory.map(array => {
                  let className;
                  array[1] === this.props.userId
                    ? (className = "receiver")
                    : (className = "sender");
                  return <li className={className}> {array[0]} </li>;
                })}
            </ul>
          </div>
          <div className="chatBox__message">
            <form className="chatBox__form">
              <input
                type="text"
                placeholder="Message"
                className="chatBox__input"
                value={this.state.message}
                onChange={ev =>
                  this.setState({
                    message: ev.target.value
                  })
                }
              />
              <button
                onClick={this.sendMsg}
                className="chatBox__button"
                type="submit"
              >
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
  return {
    sendMessage: (msg, userId) => dispatch(sendMessage(msg, userId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
