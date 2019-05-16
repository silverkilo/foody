import React from "react";
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import axios from "axios";

let data = [
  {
    name: "fake-name",
    color: [0, 0, 255],
    path: [
      // [-74.00578, 40.713067],
      // [-74.004577, 40.712425],
      // [-74.003626, 40.71365],
      // [-74.002666, 40.714243],
      // [-74.002136, 40.715177],
      // [-73.998493, 40.713452],
      // [-73.997981, 40.713673],
      // [-73.997586, 40.713448],
      // [-73.99256, 40.713863],
      // [-73.992637, 40.714706],
      // [-73.988995, 40.721608],
      // [-73.988487, 40.723418],
      // [-73.980869, 40.733895],
      // [-73.979701, 40.733362],
      // [-73.979628, 40.732848],
      // [-73.978613, 40.732169],
      // [-73.977585, 40.732152],
      // [-73.977876, 40.732047],
      // [-73.977712, 40.731873]
    ]
  }
];

const layer = [
  new PathLayer({
    id: "path-layer",
    data,
    getWidth: data => 3,
    getColor: data => data.color,
    widthMinPixels: 5
  }),
  new ScatterplotLayer({
    id: "scatterplot - layer",
    data: [
      {
        position: [-74.00578, 40.713067],
        radius: 5,
        color: [0, 255, 0]
      }
    ],
    radiusScale: 100
  })
];

export default class NavigationTest extends React.Component {
  state = {
    loadedData: false
  };

  componentDidMount() {
    this.getCoordinates();
  }

  getCoordinates = async () => {
    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/cycling/-74.006,40.7128;-73.9778,40.7317?geometries=geojson&access_token=pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA`;
    const res = await axios.get(endpoint);
    console.log("GEOJSON", res);
    data[0].path = res.data.routes[0].geometry.coordinates;
    this.setState({
      loadedData: true
    });
  };

  render() {
    return this.state.loadedData ? (
      <DeckGL
        initialViewState={{
          longitude: -74.006,
          latitude: 40.7128,
          zoom: 12
        }}
        controller={true}
        layers={layer}
      >
        <StaticMap
          mapStyle="mapbox://styles/rhearao/cjve4ypqx3uct1fo7p0uyb5hu"
          mapboxApiAccessToken="pk.eyJ1IjoicmhlYXJhbyIsImEiOiJjanY3NGloZm4wYzR5NGVxcGU4MXhwaTJtIn0.d_-A1vz2gnk_h1GbTchULA"
        />
      </DeckGL>
    ) : null;
  }
}
