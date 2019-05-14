// import React, { Component } from "react";
// import MapGL, { Marker } from "react-map-gl";
// import { connect } from "react-redux";
// import { setUserLatLong, getMatchLatLong } from "../store/location";
// import { setSelectedIdx } from "../store/highlight";
// import { getMatchPreference } from "../store/matchPreference";
// import { joinChatRoom } from "../store/chat";
// import Chat from "./Chat";
// import "./mapstyles.css";

// // const mapAccess = {
// //   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// // }

// export class Navigation extends Component {
//   constructor() {
//     super();
//     this.state = {
//       // viewport: {
//       //   width: "100%",
//       //   height: "40vh",
//       //   latitude: this.props.userLat,
//       //   longitude: this.props.userLat,
//       //   zoom: 14
//       // },
//       // showChat: false
//     };
//   }

//   componentDidMount() {
//     // window.navigator.geolocation.getCurrentPosition(this.getCurrentLocation);
//     // this.props.getMatchLatLong(this.props.userId);
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <h1>it's working</h1>
//       </React.Fragment>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     userId: state.user.id,
//     userLat: state.userMatchLatLong.user[0],
//     userLong: state.userMatchLatLong.user[1],
//     matchLat: state.userMatchLatLong.match[0],
//     matchLong: state.userMatchLatLong.match[1],
//     icon1: state.icon.icon1,
//     icon2: state.icon.icon2
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     setUserLatLong: arr => dispatch(setUserLatLong(arr)),
//     getMatchLatLong: userId => dispatch(getMatchLatLong(userId)),
//     getMatchPreference: userId => dispatch(getMatchPreference(userId)),
//     setSelectedIdx: idx => dispatch(setSelectedIdx(idx)),
//     joinChatRoom: () => dispatch(joinChatRoom())
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Navigation);
