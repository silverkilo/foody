import React, {Component} from 'react';
import { connect } from 'react-redux';

export class FoodDetails extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      price: 2,
      address: '',
      city: '',
      state: '',
      rating: '',
      photo: ''
    }
    this.getVenuesDetails = this.getVenuesDetails.bind(this)
  }

  componentDidMount() {
    this.getVenuesDetails()
  }

  getVenuesDetails() {
    const venueId = '412d2800f964a520df0c1fe3'
    const venuesEndpoint = `https://api.foursquare.com/v2/venues/${venueId}?`;

    const params = {
      client_id: 'C31O5PRPCMXK5NSFRPCN0PD5R2VRUQCOCU4TMD3MKCXCPLTF',
      client_secret: 'Z2ZPHY0VHFQIFNJKOQFAOUBVZWRKZIQJYWE1TNJGO2YJT4VR',
      v: '20130619'
    };

    fetch(venuesEndpoint + new URLSearchParams(params), {
      method: 'GET'
    }).then(response => response.json()).then(response => {
      console.log(response)
      this.setState({
        name: response.response.venue.name,
        // price: response.response.venue.price.message,
        address: response.response.venue.location.address,
        city: response.response.venue.location.city,
        state: response.response.venue.location.state,
        rating: response.response.venue.rating
      })

      for (let i = 0; i < 20; i++) {
        let eachItem = response.response.venue.tips.groups[0].items[i];
        if (eachItem.hasOwnProperty('photourl')) {
          this.setState({
            photo: eachItem.photourl
          })
          break;
        }
      }
    });


  }

  render(){
    return (
      <div>
        <h2>{this.state.name}</h2>
        <h2>{this.state.address}</h2>
        <h2>{this.state.city}, {this.state.state}</h2>
        <h2>Price: {this.state.price}</h2>
        <h2>Rating: {this.state.rating}/10</h2>
        <img src={this.state.photo} alt='new'/>
      </div>
    )
  }
}



