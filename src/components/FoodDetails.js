import React, {Component} from 'react';
import { connect } from 'react-redux';

// name, address, dollar sign, rating, photo, distance from food place
// include a yes no button below

export class FoodDetails extends Component {
  constructor(){
    super()
    this.state = {
    }
    this.getVenuesDetails = this.getVenuesDetails.bind(this)
  }

  componentDidMount() {
    this.getVenuesDetails()
  }

  getVenuesDetails() {
    const venueId = '49eeaf08f964a52078681fe3'
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?`;

    const params = {
      client_id: 'C31O5PRPCMXK5NSFRPCN0PD5R2VRUQCOCU4TMD3MKCXCPLTF',
      client_secret: 'Z2ZPHY0VHFQIFNJKOQFAOUBVZWRKZIQJYWE1TNJGO2YJT4VR',
      // venue_id: '49eeaf08f964a52078681fe3',
      v: '20130619'
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      console.log(response)
    });
  }

  render(){

    return (
      <h1>hi</h1>
    )
  }
}



