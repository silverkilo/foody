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
    <div className="newMatch">test</div>
    // <div>
    //   <h2>Congrats, you matched with</h2>
    //   <div key={id}>
    //     <p>{firstName}</p>
    //     <p>{lastName}</p>
    //     <img src={photoURLs[0]} alt={firstName} />
    //     <p>{preferences.join(", ")}</p>
    //   </div>
    // </div>
  );
}
