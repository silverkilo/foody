import React, { Component } from "react";

function handleClose() {
  let chat = document.querySelector(".chatBox");
  chat.classList.remove("is-visible");
}

export class Chat extends Component {
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
              <li className="sender">hey</li>
              <li className="receiver">whats up?</li>
              <li className="sender">hey</li>
              <li className="receiver">whats up?</li>
              <li className="sender">hey</li>
            </ul>
          </div>
          <div className="chatBox__message">
            <form className="chatBox__form">
              <input
                className="chatBox__input"
                type="text"
                placeholder="Write your message"
              />
              <button
                onClick={this.sendMessage}
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
