import React from "react";
import { Link } from "react-router-dom";
function NoMatches() {
  return (
    <div className="no-matches">
      <i className="fas fa-hamburger fa-3x" />
      <h1 className="no-matches__header">
        Can't find any more buddies for you right now.
      </h1>
      <br />
      <Link className="no-matches__header" to="/preference">
        Really Hungry? Select some new preferences.
      </Link>
    </div>
  );
}

export default NoMatches;
