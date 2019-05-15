import React from "react";
import { connect } from "react-redux";
import Routes from "./routes";
import {
  me,
  createConnection,
  matchListeners,
  chatListener,
  readyToListen,
  postLocation,
  resListener,
  setUserLocation,
  getMatchLocation
} from "./store";

class App extends React.Component {
  state = { init: false };
  async componentDidMount() {
    const user = await this.props.me(this.initSocket);
    if (user) {
      await this.initSocket();
      if (user.location) {
        this.props.setUserLocation(user.location.coordinates);
      }
    }
    this.setState({ init: true });
  }
  initSocket = async () => {
    const locationPromise = new Promise(resolve => {
      window.navigator.geolocation.getCurrentPosition(
        pos => {
          this.props.postLocation(pos);
          resolve();
        },
        err => console.log(err),
        {
          timeout: 60000,
          enableHighAccuracy: false
        }
      );
    });
    await Promise.all([
      this.props.createConnection(),
      this.props.readyToListen()
    ]);
    const matched = await this.props.matchListeners();
    if (matched) this.props.getMatchLocation();
    this.props.chatListener();
    this.props.resListener();
    locationPromise.then(() => {
      window.navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          this.props.setUserLocation([longitude, latitude]);
        },
        err => console.log(err),
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 5000
        }
      );
    });
  };
  render() {
    return this.state.init ? (
      <Routes initSocket={this.initSocket} />
    ) : (
      <div>Loading...</div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  user
});

export default connect(
  mapStateToProps,
  {
    me,
    createConnection,
    matchListeners,
    readyToListen,
    chatListener,
    postLocation,
    resListener,
    setUserLocation,
    getMatchLocation
  }
)(App);
