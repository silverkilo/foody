import React from "react";
import { connect } from "react-redux";
import Routes from "./routes";
import {
  me,
  createConnection,
  disconnectListener,
  matchListeners,
  chatListener,
  readyToListen,
  postLocation
} from "./store";

class App extends React.Component {
  state = { init: false };
  async componentDidMount() {
    await this.props.me(this.initSocket);
    this.setState({ init: true });
  }
  initSocket = async () => {
    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(
        this.props.postLocation,
        err => console.log(err),
        {
          timeout: 30000,
          enableHighAccuracy: false,
          maximumAge: 600000
        }
      );
      this.props.createConnection();
      this.props.disconnectListener();
      this.props.readyToListen(() => {
        this.props.matchListeners(resolve);
        this.props.chatListener();
      });
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
    disconnectListener,
    matchListeners,
    readyToListen,
    chatListener,
    postLocation
  }
)(App);
