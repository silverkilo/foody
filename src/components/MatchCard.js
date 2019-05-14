import React from "react";

export default function MatchCard({
  id,
  firstName,
  lastName,
  photoURLs,
  distance,
  preferences
}) {
  console.log(
    "id",
    id,
    "firstName",
    firstName,
    "lastName",
    lastName,
    "photoURLs",
    photoURLs,
    "distance",
    distance,
    "preferences",
    preferences
  );
  return (
    <div className="match__card">
      <img className="match__img" src={photoURLs[0]} alt="" />
      <div className="match__details">
        <h1 className="match__name">
          {firstName} {lastName}
        </h1>
        <ul className="match__preferences">
          {preferences.map(preference => (
            <li className="match__preference">{preference}</li>
          ))}
        </ul>
      </div>
    </div>
    // <div>
    //   {/* displaying id for debugging purposes only */}

    //   <h1 className="match-name">
    //     {id}: {firstName} {lastName}
    //   </h1>

    //   <div className="match-image">
    //     <img src={photoURLs[0]} alt={firstName} />
    //   </div>
    //   {/* match distance will be deleted, for debugging purposes only */}
    //   <strong className="match-distance">{distance}</strong>
    //   <p className="match-prefs">{preferences.join(", ")}</p>
    // </div>
  );
}
