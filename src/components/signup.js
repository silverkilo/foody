import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="signup page">
      <h1 className="signup__title">Foody</h1>
      <Link className="signup__link" to="/signup-email">
        <button className="signup__button" type="button">
          Create New Account
        </button>
      </Link>
      <Link to="/" className="signup__option">
        Log In
      </Link>
    </div>
  );
}
