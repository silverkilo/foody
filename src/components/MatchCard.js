import React from "react";

export default function MatchCard({
  id,
  firstName,
  lastName,
  photoURLs,
  distance,
  preferences
}) {
  // console.log(
  //   "id",
  //   id,
  //   "firstName",
  //   firstName,
  //   "lastName",
  //   lastName,
  //   "photoURLs",
  //   photoURLs,
  //   "distance",
  //   distance,
  //   "preferences",
  //   preferences
  // );
  return (
    <div className="match__card">
      <img className="match__img" draggable={false} src={photoURLs[0]} alt="" />
      <div className="match__details">
        <h1 className="match__name">
          <i className="fas fa-user-circle match__person" /> {firstName}{" "}
          {lastName}
        </h1>
        <ul className="match__preferences">
          {preferences.slice(0, 3).map(preference => (
            <li className="match__preference__container">
              <span className="match__preference">{preference}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
