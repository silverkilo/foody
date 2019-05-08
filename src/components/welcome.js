import React, {Component} from 'react'
import {connect} from 'react-redux'
import {logout} from '../store'
import {Link, withRouter} from 'react-router-dom'

class Welcome extends Component {
  constructor(props) {
    super(props)
    this.handleLogOut = this.handleLogOut.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleLogOut() {
    this.props.logout()
    this.props.history.push('/')
  }
  handleSubmit() {
    this.props.history.push('/Preference')
  }
  render() {
    const {firstName, lastName} = this.props.user
    return (
      <div className="welcome">
        <h1 className="welcome__title">Welcome to Foody,</h1>
        <h1 className="welcome__user">{`${firstName} ${lastName}`}</h1>
        <p className="welcome__text">
          Start searching for matches and grab something to eat.
        </p>
        <p className="welcome__text">Edit your profile below.</p>
        <button
          className="welcome__button"
          type="button"
          onClick={() => this.handleSubmit()}
        >
          Next
        </button>
        <Link to="/editprofile" className="welcome__option">
          Edit Profile
        </Link>
        <div className="email__footer">
          <p>
            Already have an account?{' '}
            <button
              className="email__footer__link"
              onClick={() => this.handleLogOut()}
            >
              Sign In.
            </button>
          </p>
        </div>
      </div>
    )
  }
}

const mapState = state => {
  return {
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(Welcome)
)
