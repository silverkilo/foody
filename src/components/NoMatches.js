import React from "react";
import { connect } from "react-redux";
function NoMatches({ connected, error, ready }) {
  return (
    <div>
      <div>No Matches to show</div>
      <div>SOCKET DEBUGGER</div>
      <div>{connected ? "CONNECTED" : "NOT CONNECTED"}</div>
      <div>{JSON.stringify(error)}</div>
      <div>{ready && "READY"}</div>
    </div>
  );
}

export default connect(({ socket }) => ({
  ...socket
}))(NoMatches);
