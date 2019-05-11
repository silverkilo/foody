// import React from 'react'

// export default function ({
//     firstName,
//     lastName,
//     photoURLs,
//     distance,
//     preferences,
//     id,
//     match,
// }) {
//     return (
//         <h1 className="match-name">
//             {firstName} {lastName}
//         </h1>

//         <div className="match-image">
//             <img src={photoURLs[0]} alt={firstName} />
//         </div>

//         <strong className="match-distance">{distance}</strong>
//         <p className="match-prefs">{preferences.join(", ")}</p>
//         <div className="match-buttons">
//             <button
//                 className="match-button-left"
//                 onClick={() => swipe(false, id, match)}
//             >
//                 Left
//     </button>
//             <button
//                 className="match-button-right"
//                 onClick={() => swipe(true, id, match)}
//             >
//                 Right
//     </button>
//         )
// }
