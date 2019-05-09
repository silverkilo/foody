import React, { Component } from "react";

function handleClose() {
  let chat = document.querySelector(".chatBox");
  chat.classList.remove("is-visible");
}
export const Chat = props => {
  return (
    <div className="chatBox">
      <div className="chatBox__inside">
        <p>Chat Room</p>
        <ul id="messages" />
        <form action="">
          <input id="m" autoComplete="off" placeholder="Discuss where you want to go!" />
          <button>Send</button>
        </form>
        <button onClick={() => handleClose()}> Close Chat </button>
      </div>
    </div>
  );
};
