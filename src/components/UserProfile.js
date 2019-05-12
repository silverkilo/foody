import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

export const UserProfile = props => {
  const { user } = props;
  return (
    <div>
      <div>
        <h1>
          Hello {user.firstName} {user.lastName}!
        </h1>
      </div>

      <div>
        <h3>Email: {user.email}</h3>
      </div>
      <div>
        <Link to="/editProfile">Update Profile</Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProps)(UserProfile);
