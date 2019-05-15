import React from "react";

export default function NewMatch({
  id,
  firstName,
  lastName,
  photoURLs,
  preferences
}) {
  console.log(id, firstName, lastName, photoURLs, preferences);
  return (
    <div className="new-match">
      <div className="new-match_container">
        <h2 className="new-match__header">Congrats, you matched with</h2>
        <div className="new-match__info" key={id}>
          <p className="new-match__first">{firstName}</p>
          <p className="new-match__last">{lastName}</p>
          <img className="new-match__img" src={photoURLs[0]} alt={firstName} />
        </div>
      </div>
    </div>
  );
}
