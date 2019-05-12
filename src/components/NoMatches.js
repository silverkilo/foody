import React from "react";
import { connect } from "react-redux";
import { socket } from "../store/socket";

function NoMatches({ connected, error, ready, debugConnection }) {
  return (
    <div>
      <div>No Matches to show</div>
      <div>DEBUG CONNECTION: {debugConnection} </div>
      <div>{connected ? "connected" : "not connected"}</div>
      <div>{JSON.stringify(error)}</div>
      <div>{ready ? "READY" : "NOT READY"}</div>
    </div>
  );
}

const mapStateToProps = ({
  socket: { connected, error, ready, debugConnection }
}) => ({
  connected,
  error,
  ready,
  debugConnection
});

export default connect(mapStateToProps)(NoMatches);
