import React, {Component} from 'react';
import ReactModal from 'react-modal';
import './chatStyle.css'

export const Chat = (props) =>{
  return (
    <div>
      <ReactModal
          isOpen={props.showChat}
          contentLabel="onRequestClose Example"
          onRequestClose={props.handleCloseChat}
          shouldCloseOnOverlayClick={false}
      >
        <p>Chat Room</p>
        <ul id="messages"></ul>
          <form action="">
            <input id="m" autocomplete="off" placeholder="Discuss where you want to go!"/><button>Send</button>

          </form>
        <button onClick={props.handleCloseChat}> Close Chat </button>
      </ReactModal>
    </div>
  );
}

