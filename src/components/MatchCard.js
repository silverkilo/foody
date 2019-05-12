import React from "react";

export default function MatchCard({
  id,
  firstName,
  lastName,
  photoURLs,
  distance,
  preferences
}) {
  return (
    <div>
      {/* displaying id for debugging purposes only */}

      <h1 className="match-name">
        {id}: {firstName} {lastName}
      </h1>

      <div className="match-image">
        <img src={photoURLs[0]} alt={firstName} />
      </div>
      {/* match distance will be deleted, for debugging purposes only */}
      <strong className="match-distance">{distance}</strong>
      <p className="match-prefs">{preferences.join(", ")}</p>
    </div>
  );
}
