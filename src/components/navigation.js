import React, { Component } from "react";
import MapGL, { Marker } from "react-map-gl";
import { connect } from "react-redux";
import "./mapstyles.css";
import axios from "axios";
import DeckGL from "@deck.gl/react";
import { PathLayer } from "@deck.gl/layers";
import "./mapstyles.css";
// const mapAccess = {
//   mapboxApiAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
// };

let data = [
  {
    name: "fake-name",
    color: [0, 0, 255],
    path: [
      [-74.008293, 40.707696],
      [-74.008016, 40.707988],
      [-74.008893, 40.709044],
      [-74.005847, 40.711688],
      [-74.006039, 40.711916],
      [-74.00519, 40.711983],
      [-74.004486, 40.711528],
      [-74.002307, 40.712682],
      [-73.997981, 40.713673],
      [-73.997536, 40.71345],
      [-73.984704, 40.714517],
      [-73.981221, 40.720812],
      [-73.974729, 40.72977],
      [-73.975874, 40.730251],
      [-73.976002, 40.730656],
      [-73.97683, 40.731161]
    ]
  }
];

const dummyResData = [-73.977, 40.731];

const initialViewState = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 14,
  pitch: 0,
  bearing: 0
};

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 14,
        pitch: 0,
        bearing: 0
      }
    };
  }

  componentDidMount() {
    this.getCoordinates();
  }

  componentDidUpdate() {
    if (
      this.props.userLat !== this.state.viewport.latitude ||
      this.props.userLong !== this.state.viewport.longitude
    ) {
      this.setState({
        viewport: {
          ...this.state.viewport,
          latitude: this.props.userLat,
          longitude: this.props.userLong
        }
      });
    }
  }

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/-74.0083,40.7077;-73.977,40.731?geometries=geojson&access_token=pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg`;
    const res = await axios.get(endpoint);
    data[0].path = res.data.routes[0].geometry.coordinates;
    console.log(data);
  };

  render() {
    const layer = [
      new PathLayer({
        id: "path-layer",
        data,
        getWidth: data => 3,
        getColor: data => data.color,
        widthMinPixels: 5
      })
      //
      // widthScale: 100,
      //
      // getPath: data => data.path,
    ];

    return (
      <React.Fragment>
        <div className="map">
          <DeckGL
            initialViewState={initialViewState}
            layers={layer}
            controller={true}
            // onViewportChange={viewport =>
            //   this.setState({
            //     viewport
            //   })
            // }
          >
            <MapGL
              mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
              mapboxApiAccessToken="pk.eyJ1Ijoib2theW9sYSIsImEiOiJjanY3MXZva2MwMnB2M3pudG0xcWhrcWN2In0.mBX1cWn8lOgPUD0LBXHkWg"
            >
              <Marker
                latitude={this.props.userLat}
                longitude={this.props.userLong}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div className={`marker marker1`} />
              </Marker>
              <Marker
                latitude={dummyResData[1]}
                longitude={dummyResData[0]}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <div className={`marker marker2`} />{" "}
              </Marker>
              }) }
            </MapGL>
          </DeckGL>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    userLong: state.location.user[0],
    userLat: state.location.user[1],
    icon1: state.icon.icon1,
    icon2: state.icon.icon2
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
