import React, {Component} from 'react'
import {connect} from 'react-redux'
import {auth, logout} from '../store'
import {withRouter} from 'react-router-dom'

class SignupEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleLogOut = this.handleLogOut.bind(this)
  }
  handleLogOut() {
    this.props.logout()
    this.props.history.push('/')
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      const email = event.target.email.value
      const formName = event.target.name
      if (email) await this.props.auth(email, 'temp', formName)
      if (this.props.user.id) {
        this.props.history.push('/signup-name')
      }
    } catch (error) {
      this.setState({
        error
      })
    }
  }
  render() {
    const {error} = this.props
    return (
      <div className="email">
        <h1 className="email__title">Enter Your Email</h1>
        {error && error.response && <div> {error.response.data} </div>}
        <form
          className="email__form"
          name="signup"
          onSubmit={this.handleSubmit}
        >
          <input
            required
            name="email"
            className="email__input"
            type="email"
            placeholder="Email"
          />
          <button className="email__button" type="submit">
            Next
          </button>
        </form>
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
    error: state.user.error,
    user: state.user
  }
}

const mapDispatch = dispatch => {
  return {
    auth: (email, password, formName) =>
      dispatch(auth(email, password, formName)),
    logout: () => dispatch(logout())
  }
}

export default withRouter(
  connect(
    mapState,
    mapDispatch
  )(SignupEmail)
)
